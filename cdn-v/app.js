
const app = new Vue({
  el: '#app',
  data: {
    perPage: 25,
    currentPage: 1,
    header: ["CODE","TYPE","MATURITY","STRIKE", "RSV", 
    "PUT_CODE", "PUT_PRICE", "PUT_RSV", "PUT_TPRICE", "PUT_VOLATILITY",
    "CALL_CODE","CALL_PRICE","CALL_RSV","CALL_TPRICE","CALL_VOLATILITY",
    "F225_PRICE", "Base_VOL"],
    fields: ["MATURITY","STRIKE",  
     "PUT_PRICE",  "PUT_TPRICE", "PUT_VOLATILITY",
     "CALL_PRICE", "CALL_TPRICE","CALL_VOLATILITY",
    ],
    items: [],
    categories:[],
    t_items:{}
  },
  created() {
    let tmp = Papa.parse(this.header.join(",") + "\n" + csv_string,{header:true}).data;
    console.log(tmp[0]);
    this.items = alasql('SELECT * FROM ? WHERE CODE="NK225E    "', [tmp]);
    this.t_items = Object.assign(
      ...Object
        .keys(this.items[0])
        .map( key => ({ [key]: this.items.map( o => o[key] ) }))
      );
    this.categories = Array.from(new Set(this.t_items["MATURITY"]));
    console.log("created"+ this.t_items)
  },
  mounted: function() {
    Plotly.plot( tester, 
      [{
        x: this.t_items['STRIKE'],
        y: this.t_items['PUT_TPRICE']
      }],
      {
        margin: { t: 0 } 
      });
  },
  computed: {
    rows() {
      return this.items.length
    }
  }
});