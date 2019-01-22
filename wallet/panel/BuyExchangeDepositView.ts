/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    
    export class BuyExchangeDepositView extends ViewBase {

        static balance: number;
        
        private inputCount:HTMLInputElement;
        private inputwithdrawCount:HTMLInputElement;
        

        private s_getWalletLists = {};


        wallet_addr: string
        wallet_addr_other: any


        height_clis: number;
        private divHeight_clis: HTMLElement;
        height_nodes: number;
        private divHeight_nodes: HTMLElement;

        // 记录每页显示数量
        listPageNum: number;

        private divNetSelect: HTMLElement;

        private depositDiv;
        private withdrawDiv;

        private depositSpan;
        private withdrawSpan;

        private exchangeAmount;
        private walletAmount;

        private exchangeCount;
        private walletCount;

        private withdrawAmount;
        private withdrawCount;

        private withdrawwalletAmount;
        private withdrawwalletCount;

        private net_fee: number = 5.5 // 网络交易费
        


        start() {
            super.start()
             
             
             this.withdrawDiv.style.display = "none"
            
        }

        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_bj", "pc_pay")

            //钱包标题
            var headerTitle = this.objCreate("div")
            headerTitle.classList.add("pc_header")
            this.ObjAppend(this.div, headerTitle)

            // 返回

            var returnA = this.objCreate("a")
            returnA.classList.add("iconfont", "icon-bc-fanhui")
             
            returnA.onclick = () => {
                this.return()
            }
            this.ObjAppend(headerTitle, returnA)

            

            

            // nodes高度
            this.divHeight_nodes = this.objCreate("div")
            this.divHeight_nodes.classList.add("pc_payheighet", "iconfont", "icon-bc-blalian", "network")
            this.divHeight_nodes.style.top = "5px";
            this.divHeight_nodes.textContent = "n/a"
            this.divHeight_nodes.onclick = () => {
                this.hidden()
                ModifyNetworkLineView.refer = "PayView"

                ModifyNetworkLineView.defaultType = "nodes"
                Main.viewMgr.change("ModifyNetworkLineView")
            }
            this.ObjAppend(headerTitle, this.divHeight_nodes)

            // clis高度
            this.divHeight_clis = this.objCreate("div")
            this.divHeight_clis.classList.add("pc_payheighet", "iconfont", "icon-bc-neolian", "network")
            this.divHeight_clis.textContent = "n/a"
            this.divHeight_clis.onclick = () => {
                if (tools.WWW.api_clis && tools.WWW.api_clis != "") {
                    this.hidden()
                    ModifyNetworkLineView.refer = "PayView"

                    ModifyNetworkLineView.defaultType = "clis"
                    Main.viewMgr.change("ModifyNetworkLineView")
                }
            }
            this.ObjAppend(headerTitle, this.divHeight_clis)



            // 钱包标题
            var headerh1 = this.objCreate("h1")
            headerh1.textContent = Main.platName;
            this.ObjAppend(headerTitle, headerh1)

            //切换网络
            var divNetType = this.objCreate("div")
            divNetType.classList.add("pc_net", "iconfont")
            divNetType.textContent = this.getNetTypeName() //Main.langMgr.get("nettype_" + Main.netMgr.type)
            divNetType.onclick = () => {
                this.showChangeNetType()
                
            }
            this.ObjAppend(headerTitle, divNetType)

            this.divNetSelect = this.objCreate("div")
            this.divNetSelect.classList.add("pc_netbox")
            this.ObjAppend(headerTitle, this.divNetSelect)

            //返回游戏
            var aReturnGame = this.objCreate("i")
            aReturnGame.classList.add("pc_returngame", "iconfont", "icon-bc-fanhui1")
            aReturnGame.onclick = () => {
                BlackCat.SDK.showIcon()
            }
            if (!window.hasOwnProperty("BC_androidSDK")) {
                this.ObjAppend(headerTitle, aReturnGame)
            } 
            

            
           

            var divpageSelect = this.objCreate("div")
            divpageSelect.classList.add("pc_pageselect") // pc_pageselect //pc_deposittabselect
            this.ObjAppend(this.div , divpageSelect)


            var divexPages = this.objCreate("div")
            divexPages.classList.add("pc_excurrency")  // pc_excurrency  // pc_depwith
            this.ObjAppend(divpageSelect, divexPages)

            
            var divexTab = this.objCreate("div")
            divexTab.classList.add("pc_excurrencynumber") //  // pc_depositwithdraw
            this.ObjAppend(divexPages, divexTab)

            this.depositSpan = this.objCreate("div")
            this.depositSpan.classList.add("active")
            this.depositSpan.innerText = Main.langMgr.get("buy_exchange_purchase_deposit")

            this.depositSpan.onclick = () => {
               
                this.withdrawDiv.style.display = "none"
                
                this.depositSpan.classList.add("active")
                this.withdrawSpan.classList.remove("active")
                
                this.depositDiv.style.display = "block"  
             
             }
            this.ObjAppend(divexTab,this.depositSpan)

            this.withdrawSpan = this.objCreate("div")
            this.withdrawSpan.innerText = Main.langMgr.get("buy_exchange_purchase_withdraw")
              

              this.withdrawSpan.onclick = () => {
               
                this.depositDiv.style.display = "none"
                
                this.withdrawSpan.classList.add("active")
                this.depositSpan.classList.remove("active")
                
                this.withdrawDiv.style.display = "block"  
             
              }
            this.ObjAppend(divexTab,this.withdrawSpan)

             
             //存入

             // PayExchangeShowWalletView.callback_params.type_src + Main.langMgr.get("pay_exchange_balance")

             this.depositDiv = this.objCreate("div")  
             this.depositDiv.classList.add("pc_exchangedeposit")
             this.ObjAppend(this.div,this.depositDiv)


            var divExBalanceBar = this.objCreate("div")
            divExBalanceBar.classList.add("pc_exchangebalance")
            this.ObjAppend(this.depositDiv,divExBalanceBar)

            var divExBalanceLabel = this.objCreate("span")
            divExBalanceLabel.classList.add("exspan")
            divExBalanceLabel.textContent = Main.langMgr.get("buy_exchange_purchase_exchangebalance") 
            this.ObjAppend(divExBalanceBar,divExBalanceLabel)
            

            this.exchangeAmount = this.objCreate("span")
            this.exchangeAmount.classList.add("centerlabel")
            this.exchangeAmount.value = 0
            this.ObjAppend(divExBalanceBar, this.exchangeAmount)

            this.exchangeCount = this.objCreate("span")
            this.exchangeCount.classList.add("exrightlabel")
            
            this.ObjAppend(divExBalanceBar,this.exchangeCount)

           

            var divwalletBalanceBar = this.objCreate("div")
            divwalletBalanceBar.classList.add("pc_exchangebalance")
            this.ObjAppend(this.depositDiv,divwalletBalanceBar)

            var divwalletBalanceLabel = this.objCreate("span")
            divwalletBalanceLabel.classList.add("exspan")
            divwalletBalanceLabel.textContent = Main.langMgr.get("buy_exchange_purchase_walletbalance") 
            this.ObjAppend(divwalletBalanceBar,divwalletBalanceLabel)
            

            this.walletAmount = this.objCreate("span")
            this.walletAmount.classList.add("excenterlabel")
            this.walletAmount.value = BuyExchangePurchaseView.balance
            this.walletAmount.innerText = BuyExchangePurchaseView.balance +" "+ BuyExchangePurchaseView.callback_params.type_src
            this.ObjAppend(divwalletBalanceBar, this.walletAmount)

            this.walletCount = this.objCreate("span")
            this.walletCount.classList.add("rightlabel")
            this.ObjAppend(divwalletBalanceBar,this.walletCount)




            var divCountBar = this.objCreate("div")
            divCountBar.classList.add("pc_exchangebalance") 
            this.ObjAppend(this.depositDiv,divCountBar)
            
            var divExDepLabel = this.objCreate("span")
            divExDepLabel.classList.add("exspan")
            divExDepLabel.textContent = Main.langMgr.get("buy_exchange_purchase_depositlabel") 
            this.ObjAppend(divCountBar,divExDepLabel)

            this.inputCount = this.objCreate("input")as HTMLInputElement
            //this.inputCount.classList.add("inputlabel")
            this.inputCount.placeholder = Main.langMgr.get("buy_exchange_purchase_depositamount") 
            this.inputCount.onkeyup = () => {

                this.exchangeAmount.textContent = this.exchangeAmount.value + (Number(this.inputCount.value)) 
                this.walletAmount.textContent = this.walletAmount.value  - (Number(this.inputCount.value)) 

                this.exchangeCount.textContent = "+" + this.inputCount.value
                this.walletCount.textContent = "-" + this.inputCount.value

                   
            }
            this.ObjAppend(divCountBar, this.inputCount)


            var divgasLabel = this.objCreate("div")
            divgasLabel.classList.add("gaslabel")
            divgasLabel.textContent = Main.langMgr.get("buy_exchange_purchase_gas") 
            this.ObjAppend(this.depositDiv,divgasLabel)
            

            var butConfirmDeposit = this.objCreate("button")
            butConfirmDeposit.classList.add("depositbutton")
            butConfirmDeposit.textContent = Main.langMgr.get("buy_exchange_purchase_confirmdeposit") 
            butConfirmDeposit.onclick = () => {
               // this.makeDeposit()
            }
            this.ObjAppend(this.depositDiv, butConfirmDeposit)


            //取出

             this.withdrawDiv = this.objCreate("div")  
             this.withdrawDiv.classList.add("pc_exchangewithdraw")
             this.ObjAppend(this.div,this.withdrawDiv) 
         
            var divExWithdrawBar = this.objCreate("div")
            divExWithdrawBar.classList.add("pc_withdrawbalance")
            this.ObjAppend(this.withdrawDiv,divExWithdrawBar)

            var divExWithdrawLabel = this.objCreate("span")
            divExWithdrawLabel.classList.add("withspan")
            divExWithdrawLabel.textContent = Main.langMgr.get("buy_exchange_purchase_exchangebalance") 
            this.ObjAppend(divExWithdrawBar,divExWithdrawLabel)
            

            this.withdrawAmount = this.objCreate("span")
            this.withdrawAmount.classList.add("withcnlabel")
            this.withdrawAmount.value = 0
            this.ObjAppend(divExWithdrawBar, this.withdrawAmount)

            this.withdrawCount = this.objCreate("span")
            this.withdrawCount.classList.add("withrightlabel")
            
            this.ObjAppend(divExWithdrawBar,this.withdrawCount)

           

            var divwithdrawwalletBalance= this.objCreate("div")
            divwithdrawwalletBalance.classList.add("pc_withdrawbalance")
            this.ObjAppend(this.withdrawDiv,divwithdrawwalletBalance)

            var divwalletBalance = this.objCreate("span")
            divwalletBalance.classList.add("withspan")
            divwalletBalance.textContent = Main.langMgr.get("buy_exchange_purchase_walletbalance") 
            this.ObjAppend(divwithdrawwalletBalance,divwalletBalance)
            

            this.withdrawwalletAmount = this.objCreate("span")
            this.withdrawwalletAmount.classList.add("withcenterlabel")
            this.withdrawwalletAmount.value = BuyExchangePurchaseView.balance
            this.withdrawwalletAmount.textContent = BuyExchangePurchaseView.balance +" "+ BuyExchangePurchaseView.callback_params.type_src
            
            this.ObjAppend(divwalletBalance, this.withdrawwalletAmount)

            this.withdrawwalletCount = this.objCreate("span")
            this.withdrawwalletCount.classList.add("withrtlabel")
            
            this.ObjAppend(divwalletBalance,this.withdrawwalletCount)


            var divwithdrawCountBar = this.objCreate("div")
            divwithdrawCountBar.classList.add("pc_withdrawbalance") 
            this.ObjAppend(this.withdrawDiv,divwithdrawCountBar)

            var divExWithLabel = this.objCreate("span")
            divExWithLabel.classList.add("withspan")
            divExWithLabel.textContent = Main.langMgr.get("buy_exchange_purchase_withdrawlabel") 
            this.ObjAppend(divwithdrawCountBar,divExWithLabel)


            this.inputwithdrawCount = this.objCreate("input")as HTMLInputElement
            this.inputwithdrawCount.placeholder = Main.langMgr.get("buy_exchange_purchase_withdrawamount") 
            this.inputwithdrawCount.onkeyup = () => {
                
                

                this.withdrawAmount.textContent = this.withdrawAmount.value + (Number(this.inputwithdrawCount.value ))
                this.withdrawwalletAmount.textContent = this.withdrawwalletAmount.value - (Number(this.inputwithdrawCount.value))

                this.withdrawCount.textContent = "+" + this.inputwithdrawCount.value
                this.withdrawwalletCount.textContent = "-" + this.inputwithdrawCount.value


                
            }
            this.ObjAppend(divwithdrawCountBar, this.inputwithdrawCount)


            var divgasfee = this.objCreate("div")
            divgasfee.classList.add("withgaslabel")
            divgasfee.textContent = Main.langMgr.get("buy_exchange_purchase_gas") 
            this.ObjAppend(this.withdrawDiv,divgasfee)
            

            var butConfirmWithdraw= this.objCreate("button")
            butConfirmWithdraw.classList.add("withdrawbutton")
            butConfirmWithdraw.textContent = Main.langMgr.get("buy_exchange_purchase_confirmwithdraw") 
            butConfirmWithdraw.onclick = () => {
                //this.makeWithdraw()
            }
            this.ObjAppend(this.withdrawDiv, butConfirmWithdraw) 


          
            
 
            





        }


        toRefer() {
            if (PayExchangeShowWalletView.refer) {
                Main.viewMgr.change(PayExchangeShowWalletView.refer)
                PayExchangeShowWalletView.refer = null;
            }
        }
    
        key_esc() {
            this.doCancel()
        }
    
        private doCancel() {
            this.addGetWalletLists()
            this.return()
        }
    
        private getNetTypeName() {
            return Main.langMgr.get("pay_nettype_" + Main.netMgr.type);
        }
    
        private showChangeNetType() {
            if (this.divNetSelect.innerHTML.length > 0) {
                this.divNetSelect.innerHTML = "";
            }
            else {
                var other = Main.netMgr.getOtherTypes()
                for (let i = 0; i < other.length; i++) {
                    this.ObjAppend(this.divNetSelect, this.getDivNetSelectType(other[i]))
                }
            }
        }
        

        private async makeDeposit(){

             // 检查金额格式
            if (!Main.viewMgr.payView.checkTransCount(this.inputCount.value)) {
                Main.showErrMsg("buy_exchange_purchase_amount_error", () => {
                    this.inputCount.focus()
                   // Main.viewMgr.buyExchangePurchaseView.btcBalance
                })
                return;
            }

            // 手续费
            var net_fee = this.net_fee
                        
            // 手续费判断
            if (Number(net_fee) > Main.viewMgr.payView.gas) {
                Main.showErrMsg("buy_exchange_purchase_gas_fee_error", () => {
                    this.inputCount.focus()
                })
                return
            }

            if(Number(this.inputCount.value) > Main.viewMgr.buyExchangePurchaseView.btcwalletBalance)   { // this should be changed dynamically per asset
             Main.showErrMsg("buy_exchange_purchase_not_enough",() => {
               this.inputCount.focus()

             })
             return
            }

            if(Number(this.inputCount.value) > Main.viewMgr.buyExchangePurchaseView.ethwalletBalance) { 
                Main.showErrMsg("buy_exchange_purchase_not_enough",() => {
                this.inputCount.focus()
                
            })
            return

            }
            //  Main.viewMgr.change("ViewLoading")
            
            
           /*
            
            try {
                var dep_count = this.inputCount.value  
                var dep_type = PayExchangeRefundView.callback_params.type_src
                //var ext     = 

                var data = {
                    asset: dep_type,
                    count: dep_count,
                  //  extString: ext,

                }
                
                var res: Result = await BlackCat.SDK.brokerDeposit(data, function (res) {
                         console.log("[BlaCat]", 'brokerDeposit.callback.function.res => ', res)
                         showFuncRes(res)
                }
            }
            catch (e) {
                var res = new Result()
                res.err = true;
                res.info = e.toString();

                console.log("[BlaCat]", '[BuyExchangeDepositView]', 'makeDeposit, BlackCat.SDK.brokerDeposit error => ', e.toString())
            }
        

            // Main.viewMgr.viewLoading.remove()
        

             if (res) {
                console.log("[BlaCat]", '[BuyExchangeDepositView]', '交易所存入结果 => ', res)
                if (res.err == false) {
                    // 成功，上报
                    await ApiTool.addUserWalletLogs(
                        Main.user.info.uid,
                        Main.user.info.token,
                        res.info,
                        "0",
                        this.inputCount.value,
                        "19",
                        '{"sbPushString":"transfer", "toaddr":"' + tat_addr + '", "count": "' + this.inputCount.value + '", "nnc": "' + tools.CoinTool["id_" + transfer_type] + '"}',
                        Main.netMgr.type, 
                        "0",
                        net_fee,
                        PayTransferView.log_type_detail[transfer_type.toLowerCase()]
                    );

                   // this.updateBalance()

                    // "提款操作成功"
                    Main.showInfo("buy_exchange_purchase_deposit_succ")



                    this.remove();
                    if (BuyExchangeDepositView.callback) BuyExchangeDepositView.callback();
                    BuyExchangeDepositView.callback = null;
                }
                else {
                    // 转账失败
                    Main.showErrMsg(("buy_exchange_purchase_deposit_fail"))
                }
            }
            else {
                Main.showErrMsg(("buy_exchange_purchase_deposit_fail"))
            }
            */
            
       }


    /*
        private async  makeWithdraw(){
            

             // 检查金额格式
            if (!Main.viewMgr.payView.checkTransCount(this.inputwithdrawCount.value)) {
                Main.showErrMsg("buy_exchange_purchase_amount_error", () => {
                    this.inputwithdrawCount.focus()
                })
                return;
            }

            // 手续费
            var net_fee = this.net_fee
                        
            // 手续费判断
            if (Number(net_fee) > Main.viewMgr.payView.gas) {
                Main.showErrMsg("buy_exchange_purchase_gas_fee_error", () => {
                    this.inputwithdrawCount.focus()
                })
                return
            }

            if(Number(this.inputwithdrawCount.value) > Main.viewMgr.buyExchangePurchaseView.btcwalletBalance)   { // this should be changed dynamically per asset
               
                Main.showErrMsg("buy_exchange_purchase_not_enough",() => {
                    this.inputwithdrawCount.focus()
     
                  })
                  return
            }

            if(Number(this.inputwithdrawCount.value) > Main.viewMgr.buyExchangePurchaseView.ethwalletBalance) {
                Main.showErrMsg("buy_exchange_purchase_not_enough",() => {
                    this.inputwithdrawCount.focus()
     
                  })
                  return

            }
             
            
            try {
                var withdraw_count = this.inputwithdrawCount.value  
                var withdraw_type = PayExchangeRefundView.callback_params.type_src
                //var ext     = 

                var data = {
                    asset: withdraw_type,
                    count: withdraw_count,
                   // extString: ext,
                }
            
                
                var res: Result = await BlackCat.SDK.brokerWithdraw(data, function (res) {
                         console.log("[BlaCat]", 'brokerWithdraw.callback.function.res => ', res) 
                         showFuncRes(res)
                
            })
        }
            catch (e) {
                var res = new Result()
                res.err = true;
                res.info = e.toString();

                console.log("[BlaCat]", '[BuyExchangeDepositView]', 'makeWithdraw, BlackCat.SDK.brokerWithdraw error => ', e.toString())
            }

            // Main.viewMgr.viewLoading.remove()

             if (res) {
                console.log("[BlaCat]", '[BuyExchangeDepositView]', '交易所取出结果 => ', res)
                if (res.err == false) {
                    // 成功，上报
                    await ApiTool.addUserWalletLogs(
                        Main.user.info.uid,
                        Main.user.info.token,
                        res.info,
                        "0",
                        this.inputwithdrawCount.value,
                        "19",
                        '{"sbPushString":"transfer", "toaddr":"' + tat_addr + '", "count": "' + this.inputCount.value + '", "nnc": "' + tools.CoinTool["id_" + transfer_type] + '"}',
                        Main.netMgr.type, 
                        "0",
                        net_fee.toString(),
                        PayTransferView.log_type_detail[transfer_type.toLowerCase()]
                    );

                   // this.updateBalance()

                    // "提款操作成功"
                    Main.showInfo("buy_exchange_purchase_withdraw_succ")



                    this.remove();
                    if (BuyExchangeDepositView.callback) BuyExchangeDepositView.callback();
                    BuyExchangeDepositView.callback = null;
                }
                else {
                    // 转账失败
                    Main.showErrMsg(("buy_exchange_purchase_withdraw_fail"))
                }
            }
            else {
                Main.showErrMsg(("buy_exchange_purchase_withdraw_fail"))
            }
            
        }
              
         */                    
 

       
    
        private getDivNetSelectType(type: number) {
            var divObj = this.objCreate("div")
            divObj.textContent = Main.langMgr.get("pay_nettype_" + type)
            divObj.onclick = () => {
                Main.changeNetType(type)
            }
            return divObj;
        }


        private addGetWalletLists() {
            var type = PayExchangeShowWalletView.callback_params.type_src
            var timeout = 1000;
            switch (type) {
                case "BTC":
                    timeout = 15 * 60 * 1000; // 15分钟
                    break;
                case "ETH":
                    timeout = 3 * 60 * 1000; // 3分钟
                    break;
                default:
                    timeout = 2 * 60 * 1000; // 2分钟
                    break;
            }
    
            if (this.s_getWalletLists.hasOwnProperty(type)) {
                if (this.s_getWalletLists[type]) {
                    clearTimeout(this.s_getWalletLists[type])
                }
            }
            this.s_getWalletLists[type] = setTimeout(() => {
                Main.viewMgr.payView.doGetWalletLists()
            }, timeout);
        }

    }
    
    
} 
    