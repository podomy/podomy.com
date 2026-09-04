# Architecture & Data Flow

Concord is a decentralized coordination engine. State is driven by an append-only event log, projected into local views, reconciled against container runtimes, and synchronized across nodes over an encrypted mesh.

---

## Data Flow Specifications

### 1. Workload Submission Flow

When a workload specification is submitted, the execution path proceeds deterministically:

1. **Submission**: The CLI or Go SDK issues a `POST /workload/submit` request containing the JSON Workload Spec to the local Unix IPC server (`~/.config/concord/concord.sock`).
2. **Event Recording**: The IPC server validates the payload and appends a `workload.spec` event to the local append-only journal (`journal.jsonl`).
3. **State Projection**: The event handler triggers a projection write into the local `bbolt` key-value store, updating indexed views for active workloads, events by ID, and node mappings.

---

### 2. Local Workload Reconciliation & Execution Flow

The local node continuously reconciles desired state against the runtime environment:

1. **State Evaluation**: The background reconciler loop monitors active workload specs in the `bbolt` key-value views.
2. **Image Retrieval**: If container images are missing locally, the reconciler pulls required layers from the embedded OCI registry (`Zot` bound to `localhost:8444`).
3. **Runtime Control**: The reconciler invokes internal container runtime primitives (`internal/cr`), provisioning Linux `cgroups` (CPU/Memory constraints), `runc` isolated namespaces, network bridges (`concord0`), and continuous `/health` probes.

---

### 3. Peer Discovery & WireGuard Mesh Flow

Nodes form partition-resilient peer networks automatically:

1. **Multi-Channel Discovery**: Node discovery combines mDNS for local network multicasting, SWIM gossip protocol over UDP `:17946` for cluster membership, and internal SRV/A DNS resolution over `:15353`.
2. **Peer Membership**: Discovered endpoints are registered in the local active memberlist.
3. **Overlay Mesh Establishment**: Peer nodes exchange WireGuard public keys and overlay IP assignments to configure flat, encrypted peer-to-peer tunnels (`internal/cn`).

---

### 4. Cross-Node State & Image Replication Flow

When nodes connect or recover from network partitions:

1. **Event Synchronization**: The peer sync loop (`internal/peersync`) establishes mTLS connections with remote peers to pull missing journal events over the WireGuard mesh.
2. **Local Application**: Missing events are appended to the local journal and projected into local `bbolt` views to drive container reconciliation.
3. **Blob Replication**: Missing container image blobs and OCI layers are streamed directly peer-to-peer into the local embedded OCI registry.

---

## Underlay vs Overlay

Concord uses two disjoint IPv4 spaces.

**Underlay** is the host NIC. Memberlist, mDNS, and the HTTPS transport use it. Join targets are underlay addresses. Peers dial whatever `ResolveAdvertise` published, never `cn0`.

**Overlay** is `10.0.0.0/16`. Each node has `cn0` at `10.0.{index}.1/24` and allocates containers in that `/24`. WireGuard carries peer `/24`s between nodes. Memberlist must not advertise `cn0`, `wg-*`, or any `10.0.0.0/16` address. Joining an overlay IP on a node that also has `cn0` is a local TCP connect, not a peer.

Simulators (including Resonance) attach a tun as the underlay NIC. That tun must not use `10.0.0.0/16`. Use a disjoint prefix such as `192.168.100.0/24`, one address per node. Overlay stays `10.0.0.0/16` inside each netns. If the tun is `10.0.0.1` / `10.0.0.2`, Concord cannot tell underlay from `cn0`, Join hits the local bridge, and membership stays at one node.

---

## Scheduling

In each connected segment, the node with the lowest UUID string is the leader. It assigns unassigned workloads to the peer with the fewest active workloads. When segments reunite, journals sync and state converges.
