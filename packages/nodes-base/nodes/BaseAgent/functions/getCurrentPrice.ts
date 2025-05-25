import axios from 'axios';

export async function getCurrentPriceByAddress(
	contractAddress: string,
	chain: string = 'base', // default to Base chain
	apiKey?: string, // optional CoinGecko API key
): Promise<any> {
	try {
		const normalizedAddress = contractAddress.toLowerCase();

		const headers: Record<string, string> = {
			accept: 'application/json',
		};

		if (apiKey) {
			headers['x-cg-demo-api-key'] = apiKey;
		}

		const url = `https://api.coingecko.com/api/v3/simple/token_price/${chain}?contract_addresses=${normalizedAddress}&vs_currencies=usd`;

		const response = await axios.get(url, { headers });

		const price = response.data?.[normalizedAddress]?.usd;

		if (price === undefined) {
			throw new Error(`Price not found for contract address: ${contractAddress}`);
		}

		return {
			success: true,
			data: {
				address: contractAddress,
				price: price.toString(),
				lastUpdated: new Date().toISOString(),
			},
		};
	} catch (error: any) {
		return {
			success: false,
			error: error.message,
		};
	}
}
