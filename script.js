import * as my_dongle from 'bleuio'
document.getElementById('connect').addEventListener('click', function(){
  my_dongle.at_connect()
})

/*
Functions to converts rssi to distance 
read more at 
https://iotandelectronics.wordpress.com/2016/10/07/how-to-calculate-distance-from-the-rssi-value-of-the-ble-beacon/
*/
const getDistance =((rssi)=>{
  let n=2
  let mp=-69
  let theDistance =  10 ** ((mp - (rssi))/(10 * n))
  return theDistance
})
document.getElementById('scan').addEventListener('click', function(){
  var range = document.getElementById("range").value;
  var element = document.getElementById("scanning");
  element.classList.remove("d-none");
  my_dongle.at_central().then((data)=>{    
    my_dongle.at_gapscan(4,false).then((dev)=>{
      //convert array string to array of object with key value
      const formated = dev.map((item) => {
        const [ id, dev,devid,none,rssi,rssival,devname ] = item.split(' ');
        return { id, dev,devid,none,rssi,rssival,devname};
      });
      //array list unique
      let uniqueArr= formated.filter(y=>y.devname!=undefined)
      //sort based on rssi value
      uniqueArr.sort((a, b) => a.rssival > b.rssival && 1 || -1)
      
      let withDistance= uniqueArr.map(r=>{
        if(getDistance(r.rssival)<=range)
          r.distance=getDistance(r.rssival).toFixed(2)+' meter'
        return r 
      }).filter(k=>{
        return k.distance!==undefined
      })
      //generate output
      let mytable = `<h2>Device List</h2>
      <table class='table table-striped table-bordered'>
      <tr>
      <th></th>
      <th>Device</th>
      <th>RSSI</th>
      <th>Distance</th>
      </tr>`;
      withDistance.map((j,index)=>{
        mytable += "<tr><td>"+parseInt(index+1)+"</td><td>" +j.devid+" - "+ j.devname + "</td><td>"+ j.rssival+"</td><td>"+j.distance+"</td></tr>";
      })
      mytable += "</table>";
      document.getElementById("deviceList").innerHTML = mytable;
      document.getElementById("numDev").innerHTML = withDistance.length+' Devices Found within '+range+' meter';
      element.classList.add("d-none");
    })
  })
})