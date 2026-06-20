"use client";

import { useEffect, useState } from "react";
import { Address } from "@scaffold-ui/components";
import type { NextPage } from "next";
import { formatUnits } from "viem";
import { base } from "viem/chains";
import { useAccount, useSwitchChain } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const CONTRACT_ADDRESS = "0xc22B7b983EC81523c969753c2385106835E8CfCE";
const CLAWD_BUY_URL = "https://basescan.org/token/0x9f86dB9fc6f7c9408e8Fda3Ff8ce4e78ac7a6b07";

type ProjectScore = {
  name: string;
  profile: number;
  opportunity: number;
  momentum: number;
  sustainability: number;
};

const SCORES: ProjectScore[] = [
  { name: "Mainnet Stables", profile: 82, opportunity: 74, momentum: 61, sustainability: 88 },
  { name: "Base Bridge", profile: 91, opportunity: 67, momentum: 79, sustainability: 72 },
  { name: "Onchain Identity", profile: 64, opportunity: 88, momentum: 55, sustainability: 69 },
  { name: "Yield Router", profile: 77, opportunity: 59, momentum: 83, sustainability: 64 },
  { name: "Restaking Vault", profile: 70, opportunity: 81, momentum: 48, sustainability: 90 },
  { name: "Intent Solver", profile: 85, opportunity: 72, momentum: 66, sustainability: 58 },
];

const ScoreTable = ({ unlocked }: { unlocked: boolean }) => {
  const blurClass = unlocked ? "" : "blur-[4px] select-none";
  return (
    <div className="card bg-base-100 shadow-md border border-base-300 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Project</th>
              <th className="text-right">Profile</th>
              <th className="text-right">Opportunity</th>
              <th className="text-right">Momentum</th>
              <th className="text-right">Sustainability</th>
            </tr>
          </thead>
          <tbody>
            {SCORES.map(row => (
              <tr key={row.name}>
                <td className="font-medium">{row.name}</td>
                <td className="text-right">{row.profile}</td>
                <td className={`text-right transition-all duration-500 ${blurClass}`}>{row.opportunity}</td>
                <td className={`text-right transition-all duration-500 ${blurClass}`}>{row.momentum}</td>
                <td className={`text-right transition-all duration-500 ${blurClass}`}>{row.sustainability}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PageShell = ({
  banner,
  table,
  contract,
}: {
  banner: React.ReactNode;
  table: React.ReactNode;
  contract: React.ReactNode;
}) => (
  <div className="flex items-center flex-col grow w-full bg-base-200">
    <div className="w-full max-w-4xl px-5 py-10 flex flex-col gap-8">
      <div className="text-center flex flex-col items-center gap-3">
        <h1 className="text-4xl font-bold m-0">CLAWD Gate</h1>
        <p className="text-base-content/70 m-0">
          Token-gated score reveal on Base. Hold CLAWD to unlock the full picture.
        </p>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-base-content/60">Contract</span>
          {contract}
        </div>
      </div>
      {banner}
      {table}
    </div>
  </div>
);

const GateDemo = () => {
  const { address: connectedAddress, isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();

  const onBase = chainId === base.id;

  const { data: hasAccess } = useScaffoldReadContract({
    contractName: "CLAWDGate",
    functionName: "hasAccess",
    args: [connectedAddress, 1],
  });

  const { data: minimumBalance } = useScaffoldReadContract({
    contractName: "CLAWDGate",
    functionName: "minimumBalance",
  });

  const { data: clawdBalance } = useScaffoldReadContract({
    contractName: "CLAWD",
    functionName: "balanceOf",
    args: [connectedAddress],
  });

  const unlocked = isConnected && onBase && Boolean(hasAccess);

  const renderGateBanner = () => {
    if (!isConnected) {
      return (
        <div className="card bg-base-100 shadow-md border border-base-300">
          <div className="card-body items-center text-center gap-4">
            <h2 className="card-title">Connect wallet to unlock scores</h2>
            <p className="text-base-content/70 m-0">
              Profile scores are public. Opportunity, Momentum and Sustainability are gated behind a CLAWD balance.
            </p>
            <RainbowKitCustomConnectButton />
          </div>
        </div>
      );
    }

    if (!onBase) {
      return (
        <div className="card bg-base-100 shadow-md border border-base-300">
          <div className="card-body items-center text-center gap-4">
            <h2 className="card-title">Wrong network</h2>
            <p className="text-base-content/70 m-0">CLAWD Gate lives on Base. Switch networks to check access.</p>
            <button className="btn btn-primary" onClick={() => switchChain?.({ chainId: base.id })}>
              Switch to Base
            </button>
          </div>
        </div>
      );
    }

    if (unlocked) {
      return (
        <div className="card bg-base-100 shadow-md border border-success">
          <div className="card-body items-center text-center gap-3">
            <div className="flex items-center gap-3">
              <h2 className="card-title m-0">✓ Access granted</h2>
              <span className="badge badge-success">Tier 1</span>
            </div>
            <p className="text-base-content/70 m-0">All score columns are unlocked for your wallet.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="card bg-base-100 shadow-md border border-warning">
        <div className="card-body items-center text-center gap-3">
          <h2 className="card-title">Insufficient CLAWD balance</h2>
          <div className="stats stats-vertical sm:stats-horizontal bg-base-200">
            <div className="stat">
              <div className="stat-title">Your balance</div>
              <div className="stat-value text-2xl">
                {clawdBalance !== undefined ? formatUnits(clawdBalance, 18) : "—"} CLAWD
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Required</div>
              <div className="stat-value text-2xl">
                {minimumBalance !== undefined ? formatUnits(minimumBalance, 18) : "10000000"} CLAWD
              </div>
            </div>
          </div>
          <a href={CLAWD_BUY_URL} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
            Get CLAWD
          </a>
        </div>
      </div>
    );
  };

  return (
    <PageShell
      banner={renderGateBanner()}
      table={<ScoreTable unlocked={unlocked} />}
      contract={<Address address={CONTRACT_ADDRESS} />}
    />
  );
};

const Home: NextPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <PageShell
        banner={
          <div className="card bg-base-100 shadow-md border border-base-300">
            <div className="card-body items-center text-center gap-4">
              <h2 className="card-title">Connect wallet to unlock scores</h2>
              <p className="text-base-content/70 m-0">
                Profile scores are public. Opportunity, Momentum and Sustainability are gated behind a CLAWD balance.
              </p>
            </div>
          </div>
        }
        table={<ScoreTable unlocked={false} />}
        contract={<span className="font-mono text-base-content/60">{CONTRACT_ADDRESS}</span>}
      />
    );
  }

  return <GateDemo />;
};

export default Home;
