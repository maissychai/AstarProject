var express = require('express');
var router = express.Router();
var db = require('../db')
var con = db.connection(mysql);
var selectUserquery = 'select users.fullname,  users.Latitude, users.Longitudefrom users inner join address on users.usersId=address.usersId where address.Kelurahan = ? && address.RW = ?'

router.route('/astardirection')
  .get(function (req, res, next) {
    var Kelurahan = req.query.Kel,
      RW = req.query.RW,
      lat = req.query.Lat,
      lng = req.query.lng,
      ArrayDirection = []

    selectdb(con, ArrayDirection, lat, lng, RW, Kelurahan, function (err, ArrayDirection) {
      ArrayDirection.sort(function (a, b) {
        return (a.Jarak - b.Jarak);
        // if jarak a < jarak b then sort it out.
      });

      var destLat = ArrayDirection[0].Latitude;
      var destLong = ArrayDirection[0].Longitude;

      res.render('maps', {
        title: 'Transaksi Terdekat - Mulung Co',
        ArrayNearest: ArrayNearest,
        lat: lat,
        lng: lng,
        destLat: destLat,
        destLong: destLong,
        adminId: adminId
      });
    })
  })

function selectdb(con, ArrayDirection, lat, lng, RW, Kelurahan, callback) {
  con.query(selectUserquery, [Kelurahan, RW], function (err, rows, fields) {
    if (err) {
      console.log(err)
      callback(err, null)
    } else {
      console.log(rows)
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].NextTransaction === 'PickUp') {
          ArrayRows.push(rows[i]);
          if (rows[i].Latitude != '' && rows[i].Longitude != '' && rows[i].Longitude != null && rows[i].Latitude != null) {
            var Jarak = gdistance(lat, long, rows[i].Latitude, rows[i].Longitude)
            Jarak = Jarak.toFixed(3)
            var Nama = rows[i].fullname;
            var latitude = rows[i].Latitude;
            var longitude = rows[i].Longitude;

            ArrayDirection.push({
              'Nama': Nama,
              'Latitude': latitude,
              'Longitude': longitude,
              'Jarak': Jarak
            })
          }
        }
      }
    }
    callback(null, ArrayDirection);
  })
}

function gdistance(lat1, lon1, lat2, lon2) {
  var R = 6371; // km
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  lat1 = toRad(lat1);
  lat2 = toRad(lat2);

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value) {
  return Value * Math.PI / 180;
}

module.exports = router;