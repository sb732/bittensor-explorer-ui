import { useEffect } from "react";

import { FetchOptions } from "../model/fetchOptions";
import { getUsdRates, getUsdRatesUpdatedAt, USD_RATES_REFRESH_RATE } from "../services/usdRatesService";

import { useResource } from "./useResource";

export function useUsdRates(
	options?: FetchOptions
) {
	const usdRates = useResource(getUsdRates, [], options);

	useEffect(() => {
		if (usdRates.data) {
			const nextRefetchAt = getUsdRatesUpdatedAt() + USD_RATES_REFRESH_RATE;
			const timeout = setTimeout(usdRates.refetch, Math.max(0, nextRefetchAt - Date.now()));
			return () => clearTimeout(timeout);
		}
	}, [usdRates]);

	return usdRates;
}
