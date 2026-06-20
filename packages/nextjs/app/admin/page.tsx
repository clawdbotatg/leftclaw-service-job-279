"use client";

import { useEffect, useState } from "react";
import { Address } from "@scaffold-ui/components";
import type { NextPage } from "next";
import { formatUnits, parseUnits } from "viem";
import { base } from "viem/chains";
import { useAccount, useSwitchChain } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const OWNER = "0xf2c44aF68aE2a983d1331b2D3aEF3c516Ae4a0Fc";

const AdminPanel = () => {
  const { address: connectedAddress, isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();

  const [tier, setTier] = useState("1");
  const [amount, setAmount] = useState("");

  const onBase = chainId === base.id;
  const isOwner = connectedAddress?.toLowerCase() === OWNER.toLowerCase();

  const { data: tier0 } = useScaffoldReadContract({
    contractName: "CLAWDGate",
    functionName: "tierThresholds",
    args: [0],
  });
  const { data: tier1 } = useScaffoldReadContract({
    contractName: "CLAWDGate",
    functionName: "tierThresholds",
    args: [1],
  });
  const { data: tier2 } = useScaffoldReadContract({
    contractName: "CLAWDGate",
    functionName: "tierThresholds",
    args: [2],
  });

  const { writeContractAsync, isPending } = useScaffoldWriteContract({
    contractName: "CLAWDGate",
  });

  const handleSubmit = async () => {
    if (!amount || Number(amount) < 0) {
      notification.error("Enter a valid CLAWD amount");
      return;
    }
    try {
      await writeContractAsync({
        functionName: "setTierThreshold",
        args: [Number(tier), parseUnits(amount, 18)],
      });
      notification.success("Tier threshold updated");
      setAmount("");
    } catch (e) {
      console.error(e);
    }
  };

  const renderThreshold = (value: bigint | undefined) =>
    value !== undefined ? `${formatUnits(value, 18)} CLAWD` : "—";

  const renderBody = () => {
    if (!isConnected) {
      return (
        <div className="card-body items-center text-center gap-4">
          <h2 className="card-title">Connect as owner</h2>
          <p className="text-base-content/70 m-0">Connect the owner wallet to manage tier thresholds.</p>
          <RainbowKitCustomConnectButton />
        </div>
      );
    }

    if (!onBase) {
      return (
        <div className="card-body items-center text-center gap-4">
          <h2 className="card-title">Wrong network</h2>
          <p className="text-base-content/70 m-0">Switch to Base to manage the gate.</p>
          <button className="btn btn-primary" onClick={() => switchChain?.({ chainId: base.id })}>
            Switch to Base
          </button>
        </div>
      );
    }

    if (!isOwner) {
      return (
        <div className="card-body items-center text-center gap-4">
          <h2 className="card-title">Connect as owner</h2>
          <p className="text-base-content/70 m-0">Only the contract owner can update thresholds.</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-base-content/60">Owner</span>
            <Address address={OWNER} />
          </div>
        </div>
      );
    }

    return (
      <div className="card-body gap-4">
        <h2 className="card-title">Set tier threshold</h2>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Tier</span>
          </label>
          <input
            type="number"
            min="0"
            className="input input-bordered"
            value={tier}
            onChange={e => setTier(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Minimum balance (CLAWD)</span>
          </label>
          <input
            type="number"
            min="0"
            placeholder="10000000"
            className="input input-bordered"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" disabled={isPending} onClick={handleSubmit}>
          {isPending ? <span className="loading loading-spinner loading-sm" /> : "Update threshold"}
        </button>
      </div>
    );
  };

  return (
    <div className="flex items-center flex-col grow w-full bg-base-200">
      <div className="w-full max-w-2xl px-5 py-10 flex flex-col gap-8">
        <div className="text-center flex flex-col items-center gap-2">
          <h1 className="text-4xl font-bold m-0">Admin</h1>
          <p className="text-base-content/70 m-0">Manage CLAWD Gate tier thresholds.</p>
        </div>

        <div className="card bg-base-100 shadow-md border border-base-300">
          <div className="card-body">
            <h2 className="card-title">Current thresholds</h2>
            <div className="stats stats-vertical sm:stats-horizontal bg-base-200">
              <div className="stat">
                <div className="stat-title">Tier 0</div>
                <div className="stat-value text-xl">{renderThreshold(tier0)}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Tier 1</div>
                <div className="stat-value text-xl">{renderThreshold(tier1)}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Tier 2</div>
                <div className="stat-value text-xl">{renderThreshold(tier2)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md border border-base-300">{renderBody()}</div>
      </div>
    </div>
  );
};

const Admin: NextPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center flex-col grow w-full bg-base-200">
        <div className="w-full max-w-2xl px-5 py-10 flex flex-col gap-8">
          <div className="text-center flex flex-col items-center gap-2">
            <h1 className="text-4xl font-bold m-0">Admin</h1>
            <p className="text-base-content/70 m-0">Manage CLAWD Gate tier thresholds.</p>
          </div>
          <div className="card bg-base-100 shadow-md border border-base-300">
            <div className="card-body items-center text-center gap-4">
              <h2 className="card-title">Connect as owner</h2>
              <p className="text-base-content/70 m-0">Connect the owner wallet to manage tier thresholds.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <AdminPanel />;
};

export default Admin;
