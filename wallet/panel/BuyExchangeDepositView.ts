/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    
    export class BuyExchangeDepositView extends ViewBase {

        static balance: number;
        
        private inputCount:HTMLInputElement;
        private inputwithdrawCount:HTMLInputElement;
        

        private selectGas: HTMLSelectElement;
        private selectToken:HTMLSelectElement;

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

            // 我的信息
            var myinfo_a = this.objCreate("a")
            myinfo_a.classList.add("iconfont", "icon-bc-touxiang")
            myinfo_a.onclick = () => {
                this.hidden()
                PersonalCenterView.refer = "PayView"
                Main.viewMgr.change("PersonalCenterView")
            }
            this.ObjAppend(headerTitle, myinfo_a)

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
            divpageSelect.classList.add("pc_pageselect")
            this.ObjAppend(this.div , divpageSelect)


            var divexPages = this.objCreate("div")
            divexPages.classList.add("pc_excurrency")
            this.ObjAppend(divpageSelect, divexPages)

            
            var divexTab = this.objCreate("div")
            divexTab.classList.add("pc_excurrencynumber")
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

             this.depositDiv = this.objCreate("div")  
             this.depositDiv.classList.add("pc_exchangedeposit")
             this.ObjAppend(this.div,this.depositDiv)


            var divExBalanceBar = this.objCreate("div")
            divExBalanceBar.classList.add("pc_exchangebalance")
            this.ObjAppend(this.depositDiv,divExBalanceBar)

            var divExBalanceLabel = this.objCreate("span")
            divExBalanceLabel.textContent = Main.langMgr.get("buy_exchange_purchase_exchangebalance") 
            this.ObjAppend(divExBalanceBar,divExBalanceLabel)
            

            var exchangeAmount = this.objCreate("span")
            exchangeAmount.classList.add("centerlabel")
            exchangeAmount.textContent = "0"
            this.ObjAppend(divExBalanceBar, exchangeAmount)

            var exchangeCount = this.objCreate("span")
            exchangeCount.classList.add("exrightlabel")
            exchangeCount.textContent = "0"
            this.ObjAppend(divExBalanceBar,exchangeCount)

           

            var divwalletBalanceBar = this.objCreate("div")
            divwalletBalanceBar.classList.add("pc_exchangebalance")
            this.ObjAppend(this.depositDiv,divwalletBalanceBar)

            var divwalletBalanceLabel = this.objCreate("span")
            divwalletBalanceLabel.textContent = Main.langMgr.get("buy_exchange_purchase_walletbalance") 
            this.ObjAppend(divwalletBalanceBar,divwalletBalanceLabel)
            

            var walletAmount = this.objCreate("span")
            walletAmount.classList.add("withcenterlabel")
            walletAmount.textContent = "0"
            this.ObjAppend(divwalletBalanceBar, walletAmount)

            var walletCount = this.objCreate("span")
            walletCount.classList.add("rightlabel")
            walletCount.textContent = "0"
            this.ObjAppend(divwalletBalanceBar,walletCount)




            var divCountBar = this.objCreate("div")
            divCountBar.classList.add("pc_exchangebalance") 
            this.ObjAppend(this.depositDiv,divCountBar)
            
            var divExDepLabel = this.objCreate("span")
            divExDepLabel.textContent = Main.langMgr.get("buy_exchange_purchase_depositlabel") 
            this.ObjAppend(divCountBar,divExDepLabel)

            this.inputCount = this.objCreate("input")as HTMLInputElement
            this.inputCount.classList.add("inputlabel")
            this.inputCount.placeholder = Main.langMgr.get("buy_exchange_purchase_depositamount") 
            this.inputCount.onkeyup = () => {
                //this.searchAddressbook()
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
               // this.doMakeReceivables()
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
            

            var withdrawAmount = this.objCreate("span")
            withdrawAmount.classList.add("withcenterlabel")
            withdrawAmount.textContent = "0"
            this.ObjAppend(divExWithdrawBar, withdrawAmount)

            var withdrawCount = this.objCreate("span")
            withdrawCount.classList.add("withcenterlabel")
            withdrawCount.textContent = "0"
            this.ObjAppend(divExWithdrawBar,withdrawCount)

           

            var divwithdrawwalletBalance= this.objCreate("div")
            divwithdrawwalletBalance.classList.add("pc_exchangebalance")
            this.ObjAppend(this.withdrawDiv,divwithdrawwalletBalance)

            var divwalletBalance = this.objCreate("span")
            divwalletBalance.textContent = Main.langMgr.get("buy_exchange_purchase_walletbalance") 
            this.ObjAppend(divwithdrawwalletBalance,divwalletBalance)
            

            var withdrawwalletAmount = this.objCreate("span")
            withdrawwalletAmount.classList.add("withcenterlabel")
            withdrawwalletAmount.textContent = "0"
            this.ObjAppend(divwalletBalance, withdrawwalletAmount)

            var withdrawwalletCount = this.objCreate("span")
            withdrawwalletCount.classList.add("withrightlabel")
            withdrawwalletCount.textContent = "0"
            this.ObjAppend(divwalletBalance,withdrawwalletCount)




            var divwithdrawCountBar = this.objCreate("div")
            divwithdrawCountBar.classList.add("pc_exchangebalance") 
            this.ObjAppend(this.withdrawDiv,divwithdrawCountBar)


            this.inputwithdrawCount = this.objCreate("input")as HTMLInputElement
            this.inputwithdrawCount.placeholder = Main.langMgr.get("buy_exchange_purchase_depositamount") 
            this.inputwithdrawCount.onkeyup = () => {
                //this.searchAddressbook()
            }
            this.ObjAppend(divwithdrawCountBar, this.inputwithdrawCount)


            var divgasfee = this.objCreate("div")
            divgasfee.classList.add("withgaslabel")
            divgasfee.textContent = Main.langMgr.get("buy_exchange_purchase_gas") 
            this.ObjAppend(this.withdrawDiv,divgasfee)
            

            var butConfirmWithdraw= this.objCreate("button")
            butConfirmWithdraw.classList.add("depositbutton")
            butConfirmWithdraw.textContent = Main.langMgr.get("buy_exchange_purchase_confirmwithdraw") 
            butConfirmWithdraw.onclick = () => {
               // this.doMakeReceivables()
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
    