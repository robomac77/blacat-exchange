namespace BlackCat {
    export class ApiTool {

        static api_version: string = "2";

        static base_url: string = ''

        private static makeUrl(cmd: string) {
            return this.base_url + '?cmd=' + cmd;
        }

        private static async common(cmd: string, post: object) {
            let formData = new FormData();
            for (let i in post) {
                formData.append(i, post[i]);
            }
            formData.append("v", this.api_version)
            var result = await fetch(this.makeUrl(cmd), {
                method: 'post',
                body: formData
            })
            var json = await result.json();
            return json;

        }
        static async isLogined(uid: string, token: string) {
            return this.common('user.isLogined', { uid: uid, token: token });
        }

        static async getPhoneCode(phone: string) {
            return this.common('user_phone.get_code', { phone: phone });
        }

        static async getGameIndex() {
            return this.common('nelapp_game.index', {});
        }

        static async phoneLogin(phone: string, code: string) {
            return this.common('user_phone.login', { phone: phone, code: code })
        }

        static async bindWallet(uid: string, token: string, wallet: string) {
            return this.common('user.bind_wallet', { uid: uid, token: token, wallet: wallet });
        }

        static async getWalletFile(uid: string, token: string) {
            return this.common('user.get_wallet_file', { uid: uid, token: token });
        }

        static async getEntergameParam(uid: string, token: string, g_id: string) {
            return this.common('user.get_entergame_param', { uid: uid, token: token, g_id: g_id });
        }

        static async addUserWalletLogs(uid: string, token: string, txid: string, g_id: string, cnts: string, type: string, params: string, net_type: number, trust: string = "0", net_fee: string = "", type_detail: string = "0") {
            return this.common('user_wallet.logss', { uid: uid, token: token, txid: txid, g_id: g_id, cnts: cnts, type: type, params: params, net_type: net_type, trust: trust, net_fee: net_fee, type_detail: type_detail });
        }

        static async getWalletListss(uid: string, token: string, page: number, num: number, net_type: number, pedding: number) {
            return this.common('user_wallet.listss', { uid: uid, token: token, page: page, num: num, net_type: net_type, pedding: pedding })
        }

        static async walletNotify(uid: string, token: string, txid: string, net_type: number) {
            return this.common('user_wallet.notify', { uid: uid, token: token, txid: txid, net_type: net_type });
        }

        static async getAppWalletNotifys(uid: string, token: string, g_id: string, net_type: number) {
            return this.common('user_wallet.get_notify', { uid: uid, token: token, g_id: g_id, net_type: net_type });
        }

        static async getPlatWalletNotifys(uid: string, token: string, net_type: number) {
            return this.common('user_wallet.get_notify_plat', { uid: uid, token: token, net_type: net_type })
        }

        static async walletNotifyExt(uid: string, token: string, txid: string, ext: string, net_type: number) {
            return this.common('user_wallet.notify_ext', { uid: uid, token: token, txid: txid, ext: ext, net_type: net_type })
        }

        static async getEnterParams(uid: string, token: string, g_id: string) {
            return this.common('user.get_enter_params', { uid: uid, token: token, g_id: g_id });
        }

        static async registerByPhone(phone: string, code: string, pwd: string, region: string, uid: string, invite_code: string, refer: string = "0") {
            return this.common('user_phone.register_pass', { phone: phone, code: code, pwd: pwd, region: region, uid: uid, invite_code: invite_code, refer: refer })
        }

        static async validPhone(phone: string) {
            return this.common('user_phone.valid_register', { phone: phone })
        }

        static async validUid(uid: string) {
            return this.common('user.valid_register', { uid: uid })
        }
        static async validInvite(uid: string, token: string, inviter_code: string) {
            return this.common('partner.get_inviter_wallet', { uid: uid, token: token, inviter_code: inviter_code })
        }

        static async registerByEmail(email: string, code: string, pwd: string, region: string, uid: string, invite_code: string, refer: string = "0") {
            return this.common('user_email.register_pass', { email: email, code: code, pwd: pwd, region: region, uid: uid, invite_code: invite_code, refer: refer })
        }

        static async validEmail(email: string) {
            return this.common('user_email.valid_register', { email: email })
        }

        static async phoneLoginPass(phone: string, pwd: string) {
            return this.common('user_phone.login_pass', { phone: phone, pwd: pwd })
        }

        static async emailLoginPass(email: string, pwd: string) {
            return this.common('user_email.login_pass', { email: email, pwd: pwd })
        }

        static async getEmailCode(email: string, lang: string) {
            return this.common('user_email.get_code', { email: email, lang: lang })
        }

        static async userLoginPass(uid: string, pwd: string) {
            return this.common('user.login', { uid: uid, pwd: pwd })
        }

        static async modUserIcon(uid: string, token: string, file: File) {
            return this.common('user_icon.upload', { uid: uid, token: token, file: file })
        }

        static async modUserName(uid: string, token: string, name: string) {
            return this.common('user.mod_name', { uid: uid, token: token, name: name })
        }

        static async modUserSex(uid: string, token: string, sex: string) {
            return this.common('user.mod_sex', { uid: uid, token: token, sex: sex })
        }

        static async modUserArea(uid: string, token: string, region: string) {
            return this.common('user.mod_region', { uid: uid, token: token, region: region })
        }

        static async modUserFee(uid: string, token: string, service_charge: string) {
            return this.common('user.mod_serviceCharge', { uid: uid, token: token, serviceCharge: service_charge })
        }

        static async forgetPassByPhone(phone: string, code: string, new_pwd: string) {
            return this.common('user_phone.mod_pwd', { phone: phone, code: code, new_pwd: new_pwd })
        }

        static async forgetPassByEmail(email: string, code: string, new_pwd: string) {
            return this.common('user_email.mod_pwd', { email: email, code: code, new_pwd: new_pwd })
        }

        static async getTrustNncs(uid: string, token: string, g_id: string) {
            return this.common('user_nncs.get_nncs', { uid: uid, token: token, g_id: g_id })
        }

        static async getTrustLists(uid: string, token: string, offset: number, num: number) {
            return this.common('user_nncs.listss', { uid: uid, token: token, offset: offset, num: num })
        }

        static async delTrustNncs(uid: string, token: string, id: string) {
            return this.common('user_nncs.del_nncs', { uid: uid, token: token, id: id })
        }

        static async addAddrbook(uid: string, token: string, address_name: string, address_wallet: string, address_desc: string) {
            return this.common('user_addressbook.add_addr', { uid: uid, token: token, address_name: address_name, address_wallet: address_wallet, address_desc: address_desc })
        }

        static async delAddrbook(uid: string, token: string, id: string) {
            return this.common('user_addressbook.del_addr', { uid: uid, token: token, id: id })
        }

        static async getAddrbook(uid: string, token: string) {
            return this.common('user_addressbook.get_addr', { uid: uid, token: token })
        }

        static async updateAddrbook(uid: string, token: string, address_name: string, address_wallet: string, address_desc: string, id: string) {
            return this.common('user_addressbook.update_addr', { uid: uid, token: token, address_name: address_name, address_wallet: address_wallet, address_desc: address_desc, id: id })
        }

        // 获取交易价格信息
        static async getExchangeInfo(uid: string, token: string, src_coin: number, net_type: number, exchange: string) {
            return this.common('wallet_transfer.get_info', { uid: uid, token: token, src_coin: src_coin, net_type: net_type, exchange: exchange })
        }

        // 获取不同类型的交易钱包地址
        static async getOtherAddress(uid: string, token: string, type_src: string, net_type: number) {
            return this.common('wallet_transfer.get_other_address', { uid: uid, token: token, type_src: type_src, net_type: net_type })
        }

        // 购买
        static async transferByOther(uid: string, token: string, type_src: string, type: string, price: string, count: string, net_type: number, txid: string, c_hash: string) {
            return this.common('wallet_transfer.buy', { uid: uid, token: token, type_src: type_src, type: type, price: price, count: count, net_type: net_type, txid: txid, c_hash: c_hash })
        }

        // 获取购买BCT的地址
        static async getBctIframe(uid: string, token: string, net_type: string, lang: string, m: string) {
            return this.common('wallet_transfer.get_pay_add', { uid: uid, token: token, net_type: net_type, lang: lang, m: m })
        }

        // 过滤非游戏assets
        static async getGameAssets(uid: string, token: string, assets: Array<string>, appid: string = "") {
            return this.common('user_wallet.get_game_assets', { uid: uid, token: token, assets: assets, appid: appid })
        }

        // 获取交易所转账记录
        static async getBrokerTransferLog(uid: string, token: string, transfer_type: number, page: number, num: number) {
            return this.common('user_broker.get_transfer_log', {uid: uid, token: token, transfer_type: transfer_type, page: page, num: num})
        }

        // 获取交易所余额
        static async getBrokerBalance(uid: string, token: string) {
            return this.common('user_broker.get_balance', {uid: uid, token: token})
        }

        // 提交交易请求
        static async brokerRequest(uid: string, token: string, asset_src: string, asset_tat: string, action: string, price: string, amount: string) {
            return this.common('user_broker.request', {uid: uid, token: token, asset_src: asset_src, asset_tat: asset_tat, action: action, price: price, amount: amount})
        }

        static async brokerWithdraw(uid: string, token: string, asset_src: string, amount: string) {
            return this.common('user_broker.withdraw', {uid: uid, token: token, asset_src: asset_src, amount: amount})
        }
    }
}