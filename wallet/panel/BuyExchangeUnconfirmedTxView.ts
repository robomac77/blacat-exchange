namespace BlackCat {
    
    export class BuyExchangeUnconfirmedTxView extends ViewBase {

        static balance: number;

        wallet_addr: string
        wallet_addr_other: any
      

        // cli高度
        height_clis: number;
        private divHeight_clis: HTMLElement;
        height_nodes: number;
        private divHeight_nodes: HTMLElement;

        // 记录每页显示数量
        listPageNum: number;

        // 钱包记录
        
        
        private divRecLists: HTMLDivElement
        private divRecListsMore: HTMLElement;
        private divNetSelect: HTMLElement;

        private recentElement: HTMLElement

        private reclistsDiv: HTMLElement;
        

        private page: number;
        private num: number;

        private isLast: boolean;

        
            create() {

                              
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_bj", "pc_paylist")

            //钱包标题
            var headerTitle = this.objCreate("div")
            headerTitle.classList.add("pc_header")
            this.ObjAppend(this.div, headerTitle)

            var returnA = this.objCreate("a")
            returnA.classList.add("iconfont", "icon-bc-fanhui")
            returnA.textContent = Main.langMgr.get("return")
             
            returnA.onclick = () => {
                this.return()
            }
            this.ObjAppend(headerTitle, returnA)
           

            // 钱包标题
            var headerh1 = this.objCreate("h1")
            headerh1.textContent = Main.langMgr.get("buy_exchange_purchase_txtitle")
            this.ObjAppend(headerTitle, headerh1)

          

            //返回游戏
           var alltx = this.objCreate("div")
            alltx.classList.add("pc_alltxtitle")
            alltx.textContent = Main.langMgr.get("buy_exchange_purchase_alltx") ;
            this.ObjAppend(headerTitle, alltx)
            

                       
            //近期记录
            this.divRecLists = this.objCreate("ul") as HTMLDivElement
            
            this.ObjAppend(this.div, this.divRecLists)

                      
            this.divRecListsMore = this.objCreate("div") as HTMLDivElement
            //this.divRecListsMore.classList.add("pc_listmore") 
            //this.divRecListsMore.textContent = Main.langMgr.get("buy_exchange_pay_more") 
            this.divRecListsMore.onclick = () => {
               
            }
          
            this.ObjAppend(this.divRecLists, this.divRecListsMore)



             this.doGetWalletLists()

            }

            toRefer() {
                if (PayExchangeShowWalletView.refer) {
                    Main.viewMgr.change(PayExchangeShowWalletView.refer)
                    PayExchangeShowWalletView.refer = null;
                }
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
                            this.divRecListsMore.textContent = Main.langMgr.get("paylist_noMore") //"没有记录了"
                        }
                        else {
                            this.page += 1;
                            this.divRecListsMore.textContent = Main.langMgr.get("paylist_getMore") //"点击加载更多记录" 
                        }*/
    
                        // 加载新数据
                        await res.data.forEach(
                            txlist => {
                                // li
                                var txlistObj = this.objCreate("li")
                                txlistObj.onclick = () => {
                                    for (var i in this.divRecLists.children) {
                                        if (this.divRecLists.children[i].className == "active") {
                                            this.divRecLists.children[i].classList.remove('active')
                                        }
                                    }
                                    txlistObj.classList.add("active")
                                    this.hidden()
                                    PayListDetailView.refer = "PayListMoreView"
                                    PayListDetailView.list = txlist;
                                    Main.viewMgr.change("PayListDetailView")
                                }
    
                                // img
                                var gameimg_div = this.objCreate("div")
                                gameimg_div.classList.add("pc_txreclistimg")
                                var img = this.objCreate("img") as HTMLImageElement
                                img.src = Main.viewMgr.payView.getListImg(txlist)
                                this.ObjAppend(gameimg_div, img)
                                this.ObjAppend(txlistObj, gameimg_div)
    
                                
                                 // Tokenname & amount
                                var txcontent_div = this.objCreate("div")
                                txcontent_div.classList.add("pc_txreclistinfo")
    
                                var tokenname_div = this.objCreate("div")
                                tokenname_div.classList.add("pc_txreclistname")
                                tokenname_div.textContent = Main.viewMgr.payView.getListName(txlist)
                                this.ObjAppend(txcontent_div, tokenname_div)

                                var txtime_div = this.objCreate("div")
                                txtime_div.classList.add(".pc_txrectime")
                                txtime_div.textContent = Main.viewMgr.payView.getListName(txlist)
                                this.ObjAppend(txcontent_div, txtime_div)

                                
    
                                //合约方法
                                var txmethod = this.objCreate("p")
                                txmethod .classList.add("pc_txrecmethod")
                                txmethod .textContent = Main.viewMgr.payView.getListParamMethods(txlist)
                                this.ObjAppend(txcontent_div, txmethod )
    
                                this.ObjAppend(txlistObj, txcontent_div)
    
                                // cnts 
                                var cnts_div = this.objCreate("div")
                                cnts_div.classList.add("pc_reccnts")
    
                                //数量
                                /*var txamount_span = this.objCreate("div")
                                txamount_span.classList.add("pc_reclistdate")
                                txamount_span.textContent = Main.viewMgr.payView.getListCtmMsg(txlist)
                                this.ObjAppend(cnts_div, txamount_span)
    
                                this.ObjAppend(txlistObj, cnts_div)*/
    
                                
    
                               /*  var cnts = Main.viewMgr.payView.getListCnts(txlist)
                                if (cnts) {
                                    this.ObjAppend(cnts_div, cnts);
    
                                    var cnts_class = Main.viewMgr.payView.getListCntsClass(txlist);
                                    if (cnts_class) cnts_div.classList.add(cnts_class)
                                } */
    
                                var state = Main.viewMgr.payView.getListState(txlist)
                                if (state) this.ObjAppend(cnts_div, state)
    
                                this.ObjAppend(txlistObj, cnts_div)
    
                                
    
                                this.ObjAppend(this.divRecLists, txlistObj)
                            }
                        );
                    }
                    else {
                        // 无交易记录
                        this.divRecListsMore.textContent = Main.langMgr.get("paylist_noRecord") //"没有记录信息哦"
                    }
                }
                else {
                    Main.showErrCode(res.errCode)
                }
       
           }
    

        }
        
    }
