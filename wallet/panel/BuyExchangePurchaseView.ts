/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />








namespace BlackCat {
    
    export class BuyExchangePurchaseView extends ViewBase {

        static balance: number;

       

        private inputPrice: HTMLInputElement
        private inputAmount:HTMLInputElement;
        private inputassetSearch:HTMLInputElement

        private buyPriceTable:HTMLTableElement;
        private sellPriceTable:HTMLTableElement;

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


        private page: number;
        private num: number;

        private isLast: boolean;

        private txlistsDiv: HTMLElement;
        private getMoreDiv: HTMLDivElement;

        private divCountBar
        private divSelectToken 

       
        private divNetSelect: HTMLElement;

        private assettabDiv;
        private buyintabDiv;
        private tradelogDiv;

         btcwalletBalance:number
         ethwalletBalance:number
         neowalletBalance:number

         btcexchangeBalance:number
         ethexchangeBalance:number
         neoexchangeBalance:number

        private exchangeBalance;
        private walletBalance

        private net_fee: string // 网络交易费

        tokenInfo = [
            {  "tokenname": "BTC" },
            {  "tokenname": "ETH" },
            {  "tokenname": "NEO" },
            {  "tokenname": "BCT" },
            {  "tokenname": "BCP" },
            {  "tokenname": "GAS" },
            {  "tokenname": "CGAS" },
            {  "tokenname": "NEO" },
            {  "tokenname": "CNEO" },]
            



        start() {
            super.start()
             
           //  this.assettabDiv.style.display = "none"
            // this.tradelogDiv.style.display = "none"
        }


        constructor() {
            super()

            this.page = 1;
            this.num = Main.viewMgr.payView.listPageNum;
            this.isLast = false;
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

            var myAssetspan = this.objCreate("div")
            myAssetspan.innerText = Main.langMgr.get("buy_exchange_purchase_myasset")
            
            myAssetspan.onclick = () => {
               
                this.tradelogDiv.style.display = "none"
                this.buyintabDiv.style.display = "none"
                
                myAssetspan.classList.add("active")
                tradeLogspan.classList.remove("active")
                buyInspan.classList.remove("active")

                this.assettabDiv.style.display = "block"  
             
             }
            this.ObjAppend(divexTab,myAssetspan)

            var buyInspan = this.objCreate("div")
            buyInspan.classList.add("active")
            buyInspan.innerText = Main.langMgr.get("buy_exchange_purchase_buyin") 
            
        
             buyInspan.onclick = () => {
               
                this.tradelogDiv.style.display = "none"
                this.assettabDiv.style.display = "none"
                
                buyInspan.classList.add("active")
                tradeLogspan.classList.remove("active")
                myAssetspan.classList.remove("active")

                this.buyintabDiv.style.display = "block"  
 
             }

            

            this.ObjAppend(divexTab,buyInspan)
            

            var sellOutspan = this.objCreate("div")
            sellOutspan.innerText = Main.langMgr.get("buy_exchange_purchase_sellout") 
            this.ObjAppend(divexTab,sellOutspan)

            var tradeLogspan = this.objCreate("div")
            tradeLogspan.innerText = Main.langMgr.get("buy_exchange_purchase_tradelog") 

            tradeLogspan.onclick= () => {
                this.buyintabDiv.style.display = "none"
                this.assettabDiv.style.display = "none"
                
                tradeLogspan.classList.add("active")
                buyInspan.classList.remove("active")
                myAssetspan.classList.remove("active")

                this.tradelogDiv.style.display = "block"

            }
            this.ObjAppend(divexTab,tradeLogspan)

            var iRefresh = this.objCreate("i")
            iRefresh.classList.add("iconfont", "icon-bc-shuaxin")
            
            this.ObjAppend(divexTab,iRefresh)

            this.buyintabDiv = this.objCreate("div") 
            this.buyintabDiv.classList.add("pc_exchangetab")
            this.ObjAppend(this.div,this.buyintabDiv)

            
        
             var divSelectBox = this.objCreate("div")
            divSelectBox.classList.add("pc_exleftpane")
            this.ObjAppend(this.buyintabDiv,divSelectBox)

            this.divSelectToken = this.objCreate("div")
            this.divSelectToken.classList.add("selecttoken")  
            this.divSelectToken.innerText = Main.langMgr.get("buy_exchange_purchase_selecttoken") 
            this.ObjAppend(divSelectBox,this.divSelectToken)

            

            this.selectToken = this.objCreate("select") as HTMLSelectElement
            this.selectToken.classList.add("tokenoption")
            var tokenType = AreaView.getAreaByLang(Main.langMgr.type)
              tokenType.forEach(
                token => {
                    var tokenoption = this.objCreate("option") as HTMLOptionElement;
                    tokenoption.setAttribute("value", token.tokenname);
                    tokenoption.textContent = Main.langMgr.get("token_type_" + token.tokenname)
                    if (token.tokenname == "BTC") {
                        tokenoption.setAttribute("selected", "selected") 
                    }
                    this.selectToken.options.add(tokenoption)

                }
            )
            this.selectToken.onchange = () => {
                tokenType.forEach(
                    token => {
                        if (token.tokenname == this.selectToken.value) {
                           this.divSelectToken.textContent = token.tokenname
                        }
                    }
                )
            }

            this.ObjAppend(this.divSelectToken, this.selectToken)

           
            

            var divDayGraph = this.objCreate("div")
            divDayGraph.classList.add("daygraph")
            this.ObjAppend(divSelectBox,divDayGraph)

            var chartDiv = this.objCreate("div")
            chartDiv.classList.add("chart")
            this.ObjAppend(divDayGraph, chartDiv)

               /* var myChart = echarts.init(chartDiv);
                var  option = {
                grid: {
                    left: 0,
                    right: 0
                },
                xAxis: {
                    type: 'category',
                    axisLine: false,
                    boundaryGap: false,
                },
                yAxis: {
                    type: 'value',
                    axisLine: false,
                    splitLine: false,
                },
                series: [{
                    data: vmm.dataList[key]["7D"],   // data source from database
                    type: 'line',
                    areaStyle: {},
                    symbolSize: 0,
                    itemStyle: {
                    normal: {
                        color: '#eee',
                        borderColor: '#1295e5',
                        lineStyle: {
                        color: "#1295e5"
                        },
                    }
                    }
                }]
                };
            myChart.setOption(option);*/

           
            var divPriceBar = this.objCreate("div")
            divPriceBar.classList.add("pricebar")
            this.ObjAppend(divSelectBox,divPriceBar)

            var divPriceBarPlus = this.objCreate("i")
            //divPriceBarPlus.classList.add("withspan")
            divPriceBarPlus.classList.add("iconfont", "icon-bc-shuaxin")
            this.ObjAppend(divPriceBar,divPriceBarPlus)



            this.inputPrice = this.objCreate("input") as HTMLInputElement
            this.inputPrice.placeholder = Main.langMgr.get("buy_exchange_purchase_inputpriceplaceholder") 
            this.inputPrice.onkeyup = () => {
                //this.searchAddressbook()
            }
            this.ObjAppend(divPriceBar, this.inputPrice)

            var divAmountBar = this.objCreate("div")
            divAmountBar.classList.add("amountbar")
            this.ObjAppend(divSelectBox,divAmountBar)

            this.inputAmount = this.objCreate("input") as HTMLInputElement
            this.inputAmount.placeholder = Main.langMgr.get("buy_exchange_purchase_inputamountplaceholder") 
            this.inputAmount.onkeyup = () => {
                //this.searchAddressbook()
            this.divCountBar.textContent = this.inputAmount.value

            }
            this.ObjAppend(divAmountBar, this.inputAmount)

            this.divCountBar = this.objCreate("div")
            this.divCountBar.classList.add("countbar")
            this.divCountBar.textContent = this.inputAmount.value  
            this.ObjAppend(divSelectBox,this.divCountBar)

            var divCountCurrency = this.objCreate("span")
            divCountCurrency.classList.add("countcurrency")
            divCountCurrency.textContent = "ETH"

            this.ObjAppend(this.divCountBar,divCountCurrency)
            
            
            var gasSelect = this.objCreate("div")
            gasSelect.classList.add("gasselect")
            gasSelect.textContent = Main.langMgr.get("buy_exchange_purchase_gas") 
            this.ObjAppend(divSelectBox,gasSelect)
            

            this.selectGas = this.objCreate("select") as HTMLSelectElement
            this.selectGas.classList.add("gasoption")
            var gasAmount = AreaView.getAreaByLang(Main.langMgr.type)
              gasAmount.forEach(
                gas => {
                    var gasoption = this.objCreate("option") as HTMLOptionElement;
                    
                    gasoption.setAttribute("value", gas.codename);
                    gasoption.textContent = Main.langMgr.get("gas_amount_" + gas.codename)
                    if (gas.codename == "CN") {
                        gasoption.setAttribute("selected", "selected")
                    }
                    this.selectGas.options.add(gasoption)

                }
            )
            this.selectGas.onchange = () => {
                gasAmount.forEach(
                    gas => {
                       // if (area.codename == this.selectArea.value) {
                        //    this.divArea.textContent = area.areacode
                     //   }
                    }
                )
            }
            this.ObjAppend(gasSelect, this.selectGas)
           


            var butBuyIn = this.objCreate("button")
            butBuyIn.classList.add("buybutton")
            butBuyIn.textContent = Main.langMgr.get("buy_exchange_purchase_buyin") 
            butBuyIn.onclick = () => {
               // this.doMakeReceivables()
            }
            this.ObjAppend(divSelectBox, butBuyIn)


            var divRightPane = this.objCreate("div")
            divRightPane.classList.add("pc_exrightpane")
            this.ObjAppend(this.buyintabDiv,divRightPane)
   
            var divTitleBar = this.objCreate("div")
             divTitleBar.classList.add("titlebar")
            this.ObjAppend(divRightPane,divTitleBar)

            var divPriceTitle = this.objCreate("span")
            divPriceTitle.classList.add("price")
            divPriceTitle.textContent = Main.langMgr.get("buy_exchange_purchase_price") 
           this.ObjAppend(divTitleBar,divPriceTitle)

           var divAmountTitle = this.objCreate("span")
           divAmountTitle.classList.add("amount")
           divAmountTitle.textContent = Main.langMgr.get("buy_exchange_purchase_amount") 
           this.ObjAppend(divTitleBar,divAmountTitle)  

            var divBuyTable = this.objCreate("div")
             divBuyTable.classList.add("pc_buytable")
            this.ObjAppend(divRightPane,divBuyTable)

            this.buyPriceTable = this.objCreate("div") as HTMLTableElement
            this.ObjAppend(divBuyTable,this.buyPriceTable)


            var divSellTable = this.objCreate("div")
            divSellTable.classList.add("pc_selltable")
           this.ObjAppend(divRightPane,divSellTable)

           
           this.sellPriceTable = this.objCreate("div") as HTMLTableElement
           this.ObjAppend(divSellTable,this.sellPriceTable)



           

           // var divAmountTitle = this.objCreate("span")
          // divAmountTitle.classList.add("amount")
          // divAmountTitle.textContent = Main.langMgr.get("buy_exchange_purchase_amount") 
          //  this.ObjAppend(divTitleBar,divAmountTitle)

            this.assettabDiv = this.objCreate("div") 
            this.assettabDiv.classList.add("pc_exchangetab")
            this.ObjAppend(this.div,this.assettabDiv)

            
 
              //SearchBar
            var divassetSearch = this.objCreate("div")
            divassetSearch.classList.add("pc_assetsearch")
            this.ObjAppend(this.assettabDiv, divassetSearch)

            var iassetSearch = this.objCreate("i")
            iassetSearch.classList.add("iconfont", "icon-bc-sousuo")
            this.ObjAppend(divassetSearch, iassetSearch)

            //搜索input
            this.inputassetSearch = this.objCreate("input") as HTMLInputElement
            this.inputassetSearch.placeholder = Main.langMgr.get("buy_exchange_purchase_assetsearch") // "搜索"
            this.inputassetSearch.onkeyup = () => {
               // this.searchAddressbook()
            }
            this.ObjAppend(divassetSearch, this.inputassetSearch)  
     
            var titleDiv = this.objCreate("div")
            titleDiv.classList.add("pc_tokentitle")
            this.ObjAppend(this.assettabDiv, titleDiv)


            var tokenSpan = this.objCreate("span");
            tokenSpan.classList.add("tokentype")
            tokenSpan.textContent = BlackCat.Main.langMgr.get("buy_exchange_purchase_tokentype");
            this.ObjAppend(titleDiv, tokenSpan)

            var exBalanceSpan = this.objCreate("span");
            exBalanceSpan.classList.add("exbalance")
            exBalanceSpan.textContent = BlackCat.Main.langMgr.get("buy_exchange_purchase_exchangetitle");
            this.ObjAppend(titleDiv, exBalanceSpan)


            var walletBalanceSpan = this.objCreate("span");
            walletBalanceSpan.classList.add("walbalance")
            walletBalanceSpan.textContent = BlackCat.Main.langMgr.get("buy_exchange_purchase_wallettitle");
            this.ObjAppend(titleDiv, walletBalanceSpan)



            var divAssetList = this.objCreate("div")
            divAssetList.classList.add("pc_assetlist")
           // divAssetList.style.display = "none"
            this.ObjAppend(this.assettabDiv, divAssetList)


            
            
              // 数量归零
                PayView.tokens_coin.forEach((coins) => {
                coins.forEach((coin) => {
                    

                let assetElement = this.objCreate("div")
                assetElement.classList.add("assetelement")
                
                assetElement.innerHTML =  Main.langMgr.get(coin)//
                this.ObjAppend(divAssetList, assetElement)

                this.exchangeBalance = this.objCreate("span")    
                this.exchangeBalance.classList.add("assetexspan")
                this.exchangeBalance.textContent = 0           // 
                this.ObjAppend(assetElement, this.exchangeBalance)

                this.walletBalance = this.objCreate("span")   
                this.walletBalance.classList.add("assetwalletspan")
                this.walletBalance.textContent = Main.viewMgr.payView[coin] 
                this.ObjAppend(assetElement, this.walletBalance)
              
                
                let moreElement = this.objCreate("i")
                moreElement.classList.add("assetmorelement")
                moreElement.classList.add("iconfont", "icon-bc-gengduo")
                this.ObjAppend(assetElement, moreElement)

                assetElement.onclick = () => {
                 this.changecoin(coin)    
                  }

                })
            })
            
            
               
                       
            this.tradelogDiv = this.objCreate("div") 
            this.tradelogDiv.classList.add("pc_txlist")  //pc_exchangetab
            this.ObjAppend(this.div,this.tradelogDiv)

            //钱包交易记录
            this.txlistsDiv = this.objCreate("ul")
            this.ObjAppend(this.tradelogDiv, this.txlistsDiv)

            /*this.getMoreDiv = this.objCreate("div") as HTMLDivElement
            this.getMoreDiv.classList.add("pc_txmore")
            this.getMoreDiv.onclick = () => {
                this.doGetWalletLists()
            }
            this.ObjAppend(this.tradelogDiv, this.getMoreDiv)*/

            this.doGetWalletLists()
            

                          
            
 }
        
       
        
        
    

    toRefer() {
        if (PayExchangeShowWalletView.refer) {
            Main.viewMgr.change(PayExchangeShowWalletView.refer)
            PayExchangeShowWalletView.refer = null;
        }
    }

    reset() {
        this.page = 1;
        this.isLast = false;
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

    private async changecoin(type: string) {
      
            this.hidden()
            BuyExchangeDepositView.refer = "BuyExchangePurchaseView"
            BuyExchangeDepositView.balance = PayView.tokens_coin[type]
            BuyExchangeDepositView.callback_params = {
                type_src: type.toUpperCase(),
                
            }
            
                Main.viewMgr.change("BuyExchangeDepositView")
            }
        
    

    private changeToken(type: string) {
        let types = ['blact', 'neo', 'other']
        for (let i = 0; i < types.length; i++) {
            this["token_list_" + types[i]].style.display = "none"
            this["token_" + types[i]].classList.remove("active")
        }
        this["token_list_" + type].style.display = "block"
        this["token_" + type].classList.add("active")
    }


    private async doGetWalletLists() {
        if (this.isLast) {
            return;
        }

        // 获取已确认的订单
        var res = await ApiTool.getWalletListss(Main.user.info.uid, Main.user.info.token, this.page, this.num, Main.netMgr.type, 0);

        if (res.r) {
            if (res.data && res.data.length >= 1) {
              /*  if (res.data.length < this.num) {
                    this.isLast = true;
                    this.getMoreDiv.textContent = Main.langMgr.get("paylist_noMore") //"没有记录了"
                }
                else {
                    this.page += 1;
                    this.getMoreDiv.textContent = Main.langMgr.get("paylist_getMore") //"点击加载更多记录"
                }*/

                // 加载新数据
                await res.data.forEach(
                    txlist => {
                        // li
                        var txlistObj = this.objCreate("li")
                        txlistObj.onclick = () => {
                            for (var i in this.txlistsDiv.children) {
                                if (this.txlistsDiv.children[i].className == "active") {
                                    this.txlistsDiv.children[i].classList.remove('active')
                                }
                            }
                            txlistObj.classList.add("active")
                            this.hidden()
                            PayListDetailView.refer = "PayListMoreView"
                            PayListDetailView.list = txlist;
                            Main.viewMgr.change("PayListDetailView")
                        }

                        

                        // txState
                        var txStatediv = this.objCreate("div")
                        txStatediv.classList.add("pc_liststate")
                        
                        txStatediv.textContent = BlackCat.Main.langMgr.get("buy_exchange_purchase_buyunconfirmed"); 
                        this.ObjAppend(txlistObj, txStatediv)

                         // Tokenname & amount
                        var txcontent_div = this.objCreate("div")  
                        txcontent_div.classList.add("pc_txinfo")

                        var tokenname_div = this.objCreate("div")
                        tokenname_div.classList.add("pc_txname")
                        tokenname_div.textContent = Main.viewMgr.payView.getListName(txlist)
                        this.ObjAppend(txcontent_div, tokenname_div)


                        //交易时间
                        var txdate_p = this.objCreate("p")
                        txdate_p .classList.add("pc_date")
                        txdate_p .textContent = Main.viewMgr.payView.getListParamMethods(txlist)
                        this.ObjAppend(txcontent_div, txdate_p )

                        this.ObjAppend(txlistObj, txcontent_div)

                        // cnts 
                        var cnts_div = this.objCreate("div")
                        cnts_div.classList.add("pc_amounts")

                        //数量
                        var txamount_span = this.objCreate("div")
                        txamount_span.classList.add("pc_amounts")
                        txamount_span.textContent = Main.viewMgr.payView.getListCtmMsg(txlist)
                        this.ObjAppend(cnts_div, txamount_span)

                

                        this.ObjAppend(txlistObj, cnts_div)

                        this.ObjAppend(this.txlistsDiv, txlistObj)
                    }
                );
            }
            else {
                // 无交易记录
                this.getMoreDiv.textContent = Main.langMgr.get("paylist_noRecord") //"没有记录信息哦"
            }
        }
        else {
            Main.showErrCode(res.errCode)
        }

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

    /*
     
    static getByCodeName(codeName: string) {
            var areaInfo = null;
            AreaView.areaInfo.forEach(
                area => {
                    if (area.codename == codeName) {
                        areaInfo = area;
                    }
                }
            )
            return areaInfo;
        }

    */


    private async doTradeRequest(){

         // 检查金额格式
         if (!Main.viewMgr.payView.checkTransCount(this.inputPrice.value)) {
            Main.showErrMsg("buy_exchange_purchase_amount_error", () => {
                this.inputPrice.focus()
            })
            return;
        }


        if (!Main.viewMgr.payView.checkTransCount(this.inputAmount.value)) {
            Main.showErrMsg("buy_exchange_purchase_amount_error", () => {
                this.inputAmount.focus()
            })
            return;
        }

        // 手续费
        var net_fee = this.net_fee
                    
        // 手续费判断
        if (Number(net_fee) > Main.viewMgr.payView.gas) {
            Main.showErrMsg("buy_exchange_purchase_gas_fee_error", () => {
                this.inputPrice.focus()
            })
            return
        }

        /*

        private async doWithdraw() {
            if(!Main.viewMgr.payView.verifyAddr(this.inputTransferAddr.value)){
               Main.showErrMsg("pay_exchange_refund_addrformat_error", () => {
                   this.inputTransferAddr.focus()
            })
            return;
        }

      
            // 检查金额格式
            if (!Main.viewMgr.payView.checkTransCount(this.inputTransferCount.value)) {
                Main.showErrMsg("pay_exchange_refund_amount_error", () => {
                    this.inputTransferCount.focus()
                })
                return;
            }

            // 手续费
            var net_fee = this.net_fee
                        
            // 手续费判断
            if (Number(net_fee) > Main.viewMgr.payView.gas) {
                Main.showErrMsg("pay_exchange_refund_gas_fee_error", () => {
                    this.inputTransferCount.focus()
                })
                return
            }

            // 余额判断
            if (Number(this.inputTransferCount.value) > (Number(PayExchangeRefundView.balance)) - Number(PayExchangeRefundView.crosschain_fee) ){  
                Main.showErrMsg("pay_exchange_refund_not_enough", () => {
                    this.inputTransferCount.focus()
                })
                return
            }

            Main.viewMgr.change("ViewLoading")

            try {
                    var asset_src = PayExchangeRefundView.callback_params.type_src
                    //var asset_tat = tokenoption.value
                    //var action = document.getElementById('broker_request_action').value
                    var price = this.inputPrice.value;              
                    var amount = this.inputAmount.value               
                    var ext = document.getElementById('broker_request_ext').value;

            var data = {
                asset_src: asset_src,
                asset_tat: asset_tat,
                action: action,
                price: price,
                amount: amount,
                extString: ext,
            }
                BlackCat.SDK.brokerRequest(data, function (res) {
                console.log("[BlaCat]", 'brokerRequest.callback.function.res => ', res)
                showFuncRes(res)
              })

            }
            catch (e) {
                var res = new Result()
                res.err = true;
                res.info = e.toString();

                console.log("[BlaCat]", '[BuyExchangePurchaseView]', 'makeTradeRequest, BlackCat.SDK.brokerDeposit error => ', e.toString())
            }


            Main.viewMgr.viewLoading.remove()

            if (res) {
                console.log("[BlaCat]", '[BuyExchangePurchaseView]', '交易所请求结果 => ', res)
                if (res.err == false) {
                    // 成功，上报
                    await ApiTool.addUserWalletLogs(
                        Main.user.info.uid,
                        Main.user.info.token,
                        res.info,
                        "0",
                        this.inputTransferCount.value,
                        "19",
                        '{"sbPushString":"transfer", "toaddr":"' + tat_addr + '", "count": "' + this.inputTransferCount.value + '", "nnc": "' + tools.CoinTool["id_" + transfer_type] + '"}',
                        Main.netMgr.type, 
                        "0",
                        net_fee,
                        PayTransferView.log_type_detail[transfer_type.toLowerCase()]
                    );

                   // this.updateBalance()

                    // "提款操作成功"
                    Main.showInfo("buy_exchange_purchase_traderequest_succ")



                    this.remove();
                    if (PayExchangeRefundView.callback) PayExchangeRefundView.callback();
                    PayExchangeRefundView.callback = null;
                }
                else {
                    // 转账失败
                    Main.showErrMsg(("buy_exchange_purchase_traderequest_fail"))
                }
            }
            else {
                {
                Main.showErrMsg(("buy_exchange_purchase_traderequest_fail"))
            }
               

        */

        
        
    }



}

}