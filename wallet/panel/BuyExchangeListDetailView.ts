/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 交易记录详情
    export class BuyExchangeListDetailView extends ViewBase {

        static list: walletLists;

        constructor() {
            super()

            if (!BuyExchangeListDetailView.list) {
                BuyExchangeListDetailView.list = new walletLists();
            }
        }

        create() {

            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_bj", "pc_listdetail")

            if (BuyExchangeListDetailView.list && BuyExchangeListDetailView.list.hasOwnProperty("wallet")) {
                // header // header标签创建比较麻烦
                var headerObj = this.objCreate("div")
                headerObj.classList.add("pc_header")
                // 返回按钮
                var returnBtn = this.objCreate("a")
                returnBtn.classList.add("iconfont", "icon-bc-fanhui")
                returnBtn.textContent = Main.langMgr.get("return") // "返回"
                returnBtn.onclick = () => {
                    this.return()
                }
                this.ObjAppend(headerObj, returnBtn)
                // h1标题
                var h1Obj = this.objCreate("h1")
                h1Obj.textContent = Main.platName
                this.ObjAppend(headerObj, h1Obj)
                this.ObjAppend(this.div, headerObj)

                var contentObj = this.objCreate("div")
                contentObj.classList.add("pc_detail")
                contentObj.innerHTML
                    = '<ul>'
                    + '<li>'
                    + '<div class="pc_liststate">'
                    + '</div>'
                    + '<div class="pc_txinfo">'
                    + '<div class="pc_txname">' + Main.viewMgr.payView.getListName(BuyExchangeListDetailView.list) + '</div>'
                    + '<span class="pc_date">' + Main.viewMgr.payView.getListCtm(BuyExchangeListDetailView.list) + '</span>'
                    + '</div>'
                    + '<div class="pc_amounts ' + Main.viewMgr.payView.getListCntsClass(BuyExchangeListDetailView.list) + ' "><span>'
                    + this.getCnts()
                    + '</span>'
                    + '<div class="pc_payheighet iconfont icon-bc-diejia">' + Main.viewMgr.payView.getListBlockindex(BuyExchangeListDetailView.list) + '</div>'
                    + Main.viewMgr.payView.getListState(BuyExchangeListDetailView.list).outerHTML
                    // +           this.getStats()
                    + '</div>'
                    + '</li>'
                    + '<li><label>' + Main.langMgr.get("paylist_txid") + '</label><p>' + this.getTxid() + '</p></li>'
                    + '<li><label>' + Main.langMgr.get("paylist_wallet") + '</label><p>' + this.getWallet() + '</p></li>'
                    + this.getParams()
                    + '</ul>'
                this.ObjAppend(this.div, contentObj)
            }
        }

        toRefer() {
            if (BuyExchangeListDetailView.refer) {
                Main.viewMgr.change(BuyExchangeListDetailView.refer);
                BuyExchangeListDetailView.refer = null;
            }
        }

        private getCnts() {
            return BuyExchangeListDetailView.list.cnts
        }

        private getTxid() {
            return BuyExchangeListDetailView.list.txid
        }

        private getWallet() {
            switch (BuyExchangeListDetailView.list.type) {
                case "9":   // 储值
                case "10":  // 钱包扣款
                    try {
                        var ext = JSON.parse(BuyExchangeListDetailView.list.ext)
                        if (ext.hasOwnProperty("wallet")) {
                            return ext.wallet
                        }
                    }
                    catch (e) {

                    }
                    //break; // 此处不需要break
                default:
                    return BuyExchangeListDetailView.list.wallet
            }
            
        }

        private getParams() {
            var html = ""
            var params: any = BuyExchangeListDetailView.list.params;
            if (params) {
                try {
                    params = JSON.parse(params)
                    if (params.hasOwnProperty("nnc") || params.hasOwnProperty("toaddr")) {
                        params = [params]
                    }
                    if (params instanceof Array) {
                        if (BuyExchangeListDetailView.list.type == "6"  // gas转账
                         || BuyExchangeListDetailView.list.type == "7"  // bcp转账
                         || BuyExchangeListDetailView.list.type == "8"  // bct转账
                         || BuyExchangeListDetailView.list.type == "13" // neo转账
                        ) {
                            // 转账
                            for (let k in params) {
                                html += '<li class="pc_contractAddress">'
                                    + '<div><label>' + Main.langMgr.get("pay_transfer_toaddr") + '</label><p>' + params[k].toaddr + '</p></div>'
                                    + '<div><label>' + Main.langMgr.get("pay_transfer_count") + '</label><p>' + params[k].count + '</p></div>'
                                    + '</li>';
                            }
                        }
                        else {
                            for (let k in params) {
                                html += '<li class="pc_contractAddress">'
                                    + '<div><label>' + Main.langMgr.get("paylist_nnc") + '</label><p>' + params[k].nnc + '</p></div>'
                                    + '<div><label>' + Main.langMgr.get("paylist_sbParamJson") + '</label><p>' + params[k].sbParamJson + '</p></div>'
                                    + '<div><label>' + Main.langMgr.get("paylist_sbPushString") + '</label><p>' + params[k].sbPushString + Main.viewMgr.payView.getListParamsMethods_extInfo(PayListDetailView.list) + '</p></div>'
                                    + '</li>';
                            }
                        }
                    }

                }
                catch (e) {
                    console.log("[BlaCat]", '[BuyExchangeListDetailView]', 'getParams error => ', e.toString())
                }
            }

            return html;
        }

    }
}