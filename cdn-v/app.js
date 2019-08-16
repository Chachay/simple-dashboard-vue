
const router = new VueRouter({
  mode: 'history',
  routes: []
});
const app = new Vue({
  router,
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
    t_items:{},
    categories:[],
    db: [],
    t_db: {},
  },
  created() {
    let tmp = Papa.parse(this.header.join(",") + "\n" + csv_string,{header:true}).data;
    console.log(tmp[0]);
    this.db = alasql('SELECT * FROM ? WHERE CODE="NK225E    "', [tmp]);
    this.t_db = Object.assign(
      ...Object
        .keys(this.db[0])
        .map( key => ({ [key]: this.db.map( o => o[key] ) }))
      );
    this.categories = Array.from(new Set(this.t_db["MATURITY"]));
    console.log("created"+ this.t_db);
  },
  mounted: function() {
    let q = this.$route.query.mat;
    if (typeof q !== 'undefined') {
      q = q.toString() + "  ";
      this.items = alasql('SELECT * FROM ? WHERE MATURITY=?', [this.db, q]);
    }else{
      this.items = alasql('SELECT * FROM ? WHERE MATURITY="201909  "', [this.db]);
    }
    this.t_items = Object.assign(
      ...Object
        .keys(this.items[0])
        .map( key => ({ [key]: this.items.map( o => o[key] ) }))
      );
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