# Overview

Concord is a coordination layer for distributed systems with unreliable, intermittent, or partitioned connections.

Traditional distributed systems freeze or fail when machines lose network access because they depend on a central truth or synchronous quorums (like etcd/Raft). Concord is built from the ground up for environments where networks are degraded, intermittent, or absent. Every node operates independently from its local journal and synchronizes state deterministically whenever connections become available.

---

## Core Philosophy

1. **Local-first execution**: A node always trusts its local journal to execute workloads, even with zero peers reachable.
2. **Deterministic reconciliation**: State is an append-only event log. There is no central master or hidden database.
3. **Zero daemon bloat**: Direct OCI/runc container execution with cgroups isolation.
4. **Autonomous mesh**: Encrypted peer-to-peer WireGuard mesh with SWIM gossip discovery.

---

## Three Primitives

* **Journal**: An append-only log of immutable events (`workload.spec`, `workload.tombstone`, `node.started`).
* **Workloads**: Declarative specifications defining execution parameters, environment, ports, and health checks.
* **Mesh**: Automatic WireGuard tunnels between nodes, with mutual Noise authentication on the sync transport.

---

## Next Steps

* [Architecture](/concord/docs/architecture/) <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-block;vertical-align:-3px"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg> How Concord works under the hood.
* [Noise Transport](/concord/docs/noise/) <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-block;vertical-align:-3px"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg> Mutual authentication on the sync transport.
* [CLI Reference](/concord/docs/cli/) <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-block;vertical-align:-3px"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg> Command line commands and usage.
* [Go SDK](/concord/docs/sdk/) <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-block;vertical-align:-3px"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg> Programmatic workload management.
* [Deployment](/concord/docs/deployment/) <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-block;vertical-align:-3px"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg> Running nodes and clustering.
