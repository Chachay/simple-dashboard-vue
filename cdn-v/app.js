
const app = new Vue({
  el: '#app',
  data: {
    items: [
      { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
      { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
      { age: 89, first_name: 'Geneva', last_name: 'Wilson' },
      { age: 38, first_name: 'Jami', last_name: 'Carney' }
    ],
    t_items:{}
  },
  created() {
    this.t_items = Object.assign(
      ...Object
        .keys(this.items[0])
        .map( key => ({ [key]: this.items.map( o => o[key] ) }))
      );
    console.log("created"+ this.t_items)
  },
  mounted: function() {
    Plotly.plot( tester, 
      [{
        x: this.t_items['first_name'],
        y: this.t_items['age']
      }],
      {
        margin: { t: 0 } 
      });
  }
});