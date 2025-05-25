import type { Hex } from 'viem';
import { createWalletClient, http, parseEther } from 'viem';
import { base } from 'viem/chains';

interface SendPaymentParams {
	to: string;
	amount: string;
	tokenAddress?: string; // Optional: if not provided, sends native token
}

export async function sendPayment(params: SendPaymentParams, chainId: number, privateKey: Hex) {
	// const publicClient = createPublicClient({
	//     chain: base,
	//     transport: http(),
	// });

	const walletClient = createWalletClient({
		account: privateKey,
		chain: base,
		transport: http(),
	});

	const { to, amount, tokenAddress } = params;

	if (tokenAddress) {
		// Send ERC20 token
		const abi = [
			{
				name: 'transfer',
				type: 'function',
				stateMutability: 'nonpayable',
				inputs: [
					{ name: 'to', type: 'address' },
					{ name: 'amount', type: 'uint256' },
				],
				outputs: [{ name: '', type: 'bool' }],
			},
		];

		const hash = await walletClient.writeContract({
			address: tokenAddress as Hex,
			abi,
			functionName: 'transfer',
			args: [to as Hex, parseEther(amount)],
		});

		return {
			transactionHash: hash,
			status: 'pending',
			type: 'ERC20',
		};
	} else {
		// Send native token
		const hash = await walletClient.sendTransaction({
			to: to as Hex,
			value: parseEther(amount),
		});

		return {
			transactionHash: hash,
			status: 'pending',
			type: 'native',
		};
	}
}
