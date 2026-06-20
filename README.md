# CLAWD Gate

Token-gated score reveal powered by CLAWD on Base. Visitors see project names and Profile scores freely; Opportunity/Momentum/Sustainability scores are blurred until the visitor holds a minimum CLAWD balance.

## Contracts (Base Mainnet)

| Contract | Address |
|----------|---------|
| CLAWDGate | [0xc22B7b983EC81523c969753c2385106835E8CfCE](https://basescan.org/address/0xc22B7b983EC81523c969753c2385106835E8CfCE) |

## Architecture

**CLAWDGate.sol** — Read-only token gate. Checks wallet CLAWD balance against configurable tier thresholds. No funds held.

- `hasAccess(wallet, tier)` — primary gate check (pure onchain read)
- `setTierThreshold(tier, minBalance)` — owner-only threshold update
- Default: Tier 1 requires 10M CLAWD (18 decimals)

**Owner:** 0xf2c44aF68aE2a983d1331b2D3aEF3c516Ae4a0Fc

## Integration Snippet (for your Vercel site)

```tsx
import { useReadContract } from "wagmi";
import { base } from "viem/chains";

const CLAWD_GATE_ADDRESS = "0xc22B7b983EC81523c969753c2385106835E8CfCE";
const CLAWD_GATE_ABI = [
  {
    name: "hasAccess",
    type: "function",
    inputs: [
      { name: "wallet", type: "address" },
      { name: "tier", type: "uint8" }
    ],
    outputs: [{ type: "bool" }],
    stateMutability: "view"
  }
] as const;

export function useGateAccess(address: string | undefined) {
  return useReadContract({
    address: CLAWD_GATE_ADDRESS,
    abi: CLAWD_GATE_ABI,
    functionName: "hasAccess",
    args: address ? [address as `0x${string}`, 1] : undefined,
    chainId: base.id,
    query: { enabled: !!address }
  });
}

// Usage in your component:
// const { data: hasAccess } = useGateAccess(connectedAddress);
// {hasAccess ? <UnblockedContent /> : <BlurredContent />}
```

## Local Development

```bash
yarn install
yarn chain     # Start local fork
yarn deploy    # Deploy to local fork
yarn start     # Frontend at localhost:3000
```
