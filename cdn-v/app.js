
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
    currentMat: "",
    currentNI225: 0.0,
    currentVol: 0.0,
  },
  created() {},
  watch: {
    '$route': 'update_data'
  },
  methods: {
    update_data(){
      if(this.db.length < 1) return;
      let q = this.$route.query.mat;
      if (typeof q !== 'undefined') {
        q = q.toString();
      }else{
        q = this.categories[0];
      }
      this.items = this.db.filter(el => el.MATURITY === q)
      this.t_items = Object.assign(
        ...Object
          .keys(this.items[0])
          .map( key => ({ [key]: this.items.map( o => o[key] ) }))
        );
      Plotly.newPlot( tester, 
        [{
          x: this.t_items['STRIKE'],
          y: this.t_items['PUT_TPRICE'],
          type: 'scatter'
        }],
        {
          margin: { t: 0 } ,
          title: 'Option Price'
        });
      this.currentMat = q;
      this.currentNI225 = Number.parseFloat(this.t_items.F225_PRICE[0])
      this.currentVol= Number.parseFloat(this.t_items.Base_VOL[0])
    },
    load_data(data){
      this.db = data;
      this.t_db = Object.assign(
        ...Object
          .keys(this.db[0])
          .map( key => ({ [key]: this.db.map( o => o[key] ) }))
        );
      this.categories = Array.from(new Set(this.t_db["MATURITY"]));
    },
    read(input){
      const reader = new FileReader();
      const csv = input.target.files[0];
      reader.onload = (event) => {
        const tmp = Papa.parse(this.header.join(",") + "\n" + event.target.result, {header:true}).data
              .filter( el => el.CODE === "NK225E    ");
        console.log(tmp[0]);
        this.load_data(tmp);
        this.update_data();
      };
      reader.readAsText(csv);
    }
  },
  mounted (){
    this.update_data();
  },
  computed: {
    rows() {
      return this.items.length
    }
  }
});