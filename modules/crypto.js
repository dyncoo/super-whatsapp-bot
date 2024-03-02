const axios = require('axios')
const randomUseragent = require('random-useragent');
const config_data = require('../config.js');

default_tokens = config_data['crypto_default'].split(',')
default_currency = config_data.currency
possible_tokens = ["00", "1INCH", "AAVE", "ABT", "ACH", "ACS", "ADA", "AERGO", "AGLD", "AIOZ", "ALCX", "ALEPH", "ALGO", "ALICE", "AMP", "ANKR", "ANT", "APE", "API3", "APT", "ARB", "ARPA", "ASM", "AST", "ATA", "ATOM", "AUCTION", "AUDIO", "AURORA", "AVAX", "AVT", "AXL", "AXS", "BADGER", "BAL", "BAND", "BAT", "BCH", "BICO", "BIGTIME", "BIT", "BLUR", "BLZ", "BNT", "BOBA", "BOND", "BTC", "BTRST", "BUSD", "C98", "CBETH", "CELR", "CGLD", "CHZ", "CLV", "COMP", "COTI", "COVAL", "CRO", "CRPT", "CRV", "CTSI", "CTX", "CVC", "CVX", "DAI", "DAR", "DASH", "DDX", "DESO", "DEXT", "DIA", "DIMO", "DNT", "DOGE", "DOT", "DREP", "DYP", "EGLD", "ELA", "ENJ", "ENS", "EOS", "ERN", "ETC", "ETH", "EUROC", "FARM", "FET", "FIDA", "FIL", "FIS", "FLOW", "FLR", "FORT", "FORTH", "FOX", "FX", "GAL", "GALA", "GFI", "GHST", "GLM", "GMT", "GNO", "GNT", "GODS", "GRT", "GST", "GTC", "GUSD", "GYEN", "HBAR", "HFT", "HIGH", "HNT", "HOPR", "ICP", "IDEX", "ILV", "IMX", "INDEX", "INJ", "INV", "IOTX", "JASMY", "JUP", "KAVA", "KEEP", "KNC", "KRL", "KSM", "LCX", "LDO", "LINK", "LIT", "LOKA", "LOOM", "LPT", "LQTY", "LRC", "LSETH", "LTC", "MAGIC", "MANA", "MASK", "MATH", "MATIC", "MCO2", "MDT", "MEDIA", "METIS", "MINA", "MIR", "MKR", "MLN", "MNDE", "MONA", "MPL", "MSOL", "MTL", "MULTI", "MUSD", "MUSE", "MXC", "NCT", "NEAR", "NEST", "NKN", "NMR", "NU", "OCEAN", "OGN", "OMG", "OOKI", "OP", "ORCA", "ORN", "OSMO", "OXT", "PAX", "PERP", "PLA", "PLU", "PNG", "POLS", "POLY", "POND", "POWR", "PRIME", "PRO", "PRQ", "PUNDIX", "PYR", "PYUSD", "QI", "QNT", "QSP", "QUICK", "RAD", "RAI", "RARE", "RARI", "RBN", "REN", "REP", "REQ", "RGT", "RLC", "RLY", "RNDR", "ROSE", "RPL", "SAND", "SEI", "SHIB", "SHPING", "SKL", "SNT", "SNX", "SOL", "SPA", "SPELL", "STG", "STORJ", "STX", "SUI", "SUKU", "SUPER", "SUSHI", "SWFTC", "SYLO", "SYN", "T", "TBTC", "TIA", "TIME", "TONE", "TRAC", "TRB", "TRIBE", "TRU", "TVK", "UMA", "UNFI", "UNI", "UPI", "USDC", "USDT", "UST", "VARA", "VET", "VGX", "VOXEL", "VTHO", "WAMPL", "WAXL", "WBTC", "WCFG", "WLUNA", "XCN", "XLM", "XMON", "XRP", "XTZ", "XYO", "YFI", "YFII", "ZEC", "ZEN", "ZRX"]

async function getCrypto(token,cur) {
    cur = cur.toUpperCase()
    let random_user_agent = randomUseragent.getRandom();
    var mainconfig = {
        timeout: 5000,
        headers: {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'accept-language': 'en-US,en;q=0.5',
            'user-agent': random_user_agent
        },
        method: 'get',
        url: `https://api.coinbase.com/v2/exchange-rates?currency=${token}`
    }

    res_obj = {}

    return axios(mainconfig)
        .then(async function(response) {
            res_obj['status'] = 200
            try {                
                if(cur in response['data']['data']['rates']) {
                    res_obj['token_price'] = `${parseFloat(response['data']['data']['rates'][cur]).toFixed(2)}`
                    res_obj['token_currency'] = `${cur}`
                } else {
                    res_obj['token_price'] = `${parseFloat(response['data']['data']['rates'][default_currency]).toFixed(2)}`
                    res_obj['token_currency'] = `${default_currency}`
                }
            } catch (err) {
                res_obj['status'] = 401
                res_obj['token_price'] = '0 (err)'
                res_obj['token_currency'] = 'None (err)'
                console.error(err);
            } 
            return res_obj
        })
        .catch(function(error) {
            res_obj['status'] = 400
            res_obj['token_price'] = '0 (err)'
            res_obj['token_currency'] = 'None (err)'
            return res_obj
        })
}
async function getAllCrypto(args) {
    total_res_obj = {}
    let anti_spam_to = 5000    
    crypto_args = args.replaceAll(', ',',')
    crypto_args_arr = crypto_args.split(' ')
    toquery_tokens = default_tokens
    toquery_currency = default_currency

    if(crypto_args_arr.length <= 1) {
        req_token_arr = crypto_args_arr[0].split(',')
        req_valid_tokens = req_token_arr.filter((curr_token) =>  {
            if(possible_tokens.includes(curr_token.toUpperCase())) return curr_token
        })
        if(req_valid_tokens.length >= 1){
            toquery_tokens = req_valid_tokens
        } else {
            toquery_currency = crypto_args_arr[0].toUpperCase()
        }
    } else {
        req_token_arr = crypto_args_arr[0].split(',')
        req_valid_tokens = req_token_arr.filter((curr_token) =>  {
            if(possible_tokens.includes(curr_token.toUpperCase())) return curr_token
        })
        toquery_tokens = req_valid_tokens
        toquery_currency = crypto_args_arr[1]
    }

    for(token_index in toquery_tokens) {
        var token_price = await getCrypto(toquery_tokens[token_index].toUpperCase(),toquery_currency)
        var retry_attempts = 1
        var token_price_found = false

        if(token_price.status == 200) {   
            total_res_obj[toquery_tokens[token_index].toUpperCase()] = token_price['token_price'] + " " + token_price['token_currency']
        } else {            
            while(!token_price_found && retry_attempts <= 3) {
                token_price = await getCrypto(toquery_tokens[token_index].toUpperCase(),toquery_currency)
                if(token_price.status == 200) {
                    token_price_found = true
                    total_res_obj[toquery_tokens[token_index].toUpperCase()] = token_price['token_price'] + " " + token_price['token_currency']
                } else {
                    await new Promise(r => setTimeout(r, anti_spam_to));
                    retry_attempts = retry_attempts + 1
                }
            }
        }
        if(token_index < toquery_tokens.length-1) {
            await new Promise(r => setTimeout(r, anti_spam_to));
        }
    }    
    return total_res_obj
}

module.exports = {
    getAllCrypto    
}