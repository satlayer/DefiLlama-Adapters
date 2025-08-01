
const { PublicKey } = require("@solana/web3.js");
const { parseLido, parseLidoValidatorList } = require('./layouts/lido')
const { parsePhoenix } = require('./layouts/phoenix-dex')
const { RAYDIUM_LIQUIDITY_STATE_LAYOUT_CLMM, RAYDIUM_STABLE_STATE_LAYOUT_V1, RAYDIUM_POSITION_INFO_LAYOUT } = require('./layouts/raydium-layout')
const { INVESTIN_FUND_DATA, } = require('./layouts/investin-layout')
const { MARKET_STATE_LAYOUT_V3, OPEN_ORDERS_LAYOUT_V2, MARKET_STATE_LAYOUT_V3_MINIMAL } = require('./layouts/openbook-layout')
const { ReserveLayout, ReserveLayoutLarix, MintLayout, AccountLayout, TokenSwapLayout, ESOLStakePoolLayout, PARLAY_LAYOUT_PARTIAL, HH_PARI_LAYOUT_PARTIAL, ACCESS_LAYOUT, 
  METEORA_STABLE_SWAP_LAYOUT, ZEUS_GUARDIAN_SETTING_LAYOUT,
} = require('./layouts/mixed-layout');
const { SCN_STAKE_POOL, TOKEN_LAYOUT, } = require("./layouts/scnSOL");
const { SANCTUM_INFINITY } = require("./layouts/sanctum-infinity-layout");
const { parseSanctumLstStateList } = require("./layouts/sanctum-validators-lsts-layout");
const { STAKE_POOL_PARTIAL } = require("./layouts/stake-pool-partial-layout");
const { STAKE_POOL_LAYOUT } = require("./layouts/stakePool");
const { JITO_VAULT_LAYOUT } = require("./layouts/jito-layout");
const { BYREAL_LIQUIDITY_STATE_LAYOUT_CLMM } = require("./layouts/byreal-layout");
const { PANCAKESWAP_V3_POOL_LAYOUT } = require("./layouts/pancakeswap-v3-layout");

const parseReserve = (info) => {
  const pubkey = PublicKey.default
  const { data } = info;
  const buffer = Buffer.from(data);
  const reserve = ReserveLayout.decode(buffer);

  if (reserve.lastUpdate.slot.isZero()) {
    return null;
  }

  const details = {
    pubkey,
    account: {
      ...info,
    },
    info: reserve,
  };

  return details;
}

const defaultParseLayout = Layout => info => {
  const { data } = info;
  const buffer = Buffer.from(data);
  return Layout.decode(buffer);
}

const customDecoders = {
  tokenAccount: defaultParseLayout(TOKEN_LAYOUT),
  reserve: parseReserve,
  lido: parseLido,
  lidoValidatorList: parseLidoValidatorList,
  mint: defaultParseLayout(MintLayout),
  account: defaultParseLayout(AccountLayout),
  tokenSwap: defaultParseLayout(TokenSwapLayout),
  larixReserve: defaultParseLayout(ReserveLayoutLarix),
  ESOLStakePool: defaultParseLayout(ESOLStakePoolLayout),
  investinFund: defaultParseLayout(INVESTIN_FUND_DATA),
  openbook: defaultParseLayout(MARKET_STATE_LAYOUT_V3),
  'openbook-minimal': defaultParseLayout(MARKET_STATE_LAYOUT_V3_MINIMAL),
  openbookOpenOrders: defaultParseLayout(OPEN_ORDERS_LAYOUT_V2),
  // raydiumLPv4: defaultParseLayout(RAYDIUM_LIQUIDITY_STATE_LAYOUT_V4),
  raydiumCLMM: defaultParseLayout(RAYDIUM_LIQUIDITY_STATE_LAYOUT_CLMM),
  raydiumPositionInfo: defaultParseLayout(RAYDIUM_POSITION_INFO_LAYOUT),
  raydiumLPStable: defaultParseLayout(RAYDIUM_STABLE_STATE_LAYOUT_V1),
  scnStakePool: defaultParseLayout(SCN_STAKE_POOL),
  fluxbeam: defaultParseLayout(TokenSwapLayout),
  phoenix: parsePhoenix,
  sanctumInfinity: defaultParseLayout(SANCTUM_INFINITY),
  sanctumValidatorLsts: parseSanctumLstStateList,
  stakePoolPartial: defaultParseLayout(STAKE_POOL_PARTIAL),
  stakePool: defaultParseLayout(STAKE_POOL_LAYOUT),
  hhParlay: defaultParseLayout(PARLAY_LAYOUT_PARTIAL),
  hhPari: defaultParseLayout(HH_PARI_LAYOUT_PARTIAL),
  access: defaultParseLayout(ACCESS_LAYOUT),
  jitoVault: defaultParseLayout(JITO_VAULT_LAYOUT),
  meteoraStablePool: defaultParseLayout(METEORA_STABLE_SWAP_LAYOUT),
  zeusGuardianSetting: defaultParseLayout(ZEUS_GUARDIAN_SETTING_LAYOUT),
  byrealCLMM: defaultParseLayout(BYREAL_LIQUIDITY_STATE_LAYOUT_CLMM),
  pancakeswapV3Pool: defaultParseLayout(PANCAKESWAP_V3_POOL_LAYOUT)
}

function decodeAccount(layout, accountInfo) {
  if (!accountInfo.data) throw new Error('Missing account data')
  if (customDecoders[layout]) return customDecoders[layout](accountInfo)
  throw new Error('Layout not found: ' + layout)
}

module.exports = {
  decodeAccount,
}