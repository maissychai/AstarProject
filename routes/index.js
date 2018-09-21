var express = require('express');
var router = express.Router();
var db = require('../db')
var con = db.connection(mysql);
var selectUserquery = 'select users.fullname, users.phone, users.usersId, users.Latitude, users.Longitude, address.* from users inner join address on users.usersId=address.usersId where address.Kelurahan = ? && address.RW = ?'

router.route('/astardirection')
  .get(function (req, res, next) {
    var Kelurahan = req.query.Kel,
      RW = req.query.RW,
      lat = req.query.Lat,
      lng = req.query.lng,
      ArrayDirection = []

    con.query(selectUserquery, [Kelurahan, RW], function (err, rows, fields) {
      if (err) {
        console.log(err)
      } else {
        console.log(rows)
        for (var i = 0; i < rows.length; i++) {
          if (rows[i].NextTransaction === 'PickUp') {
            ArrayRows.push(rows[i]);
            if (rows[i].Latitude != '' && rows[i].Longitude != '' && rows[i].Longitude != null && rows[i].Latitude != null) {
              var Jarak = gdistance(lat, long, rows[i].Latitude, rows[i].Longitude)
              Jarak = Jarak.toFixed(3)
              var Nama = rows[i].fullname;
              var NamaJalan = rows[i].NamaJalan;
              var RT = rows[i].RT;
              var RW = rows[i].RW;
              var Kel = rows[i].Kelurahan;
              var Kec = rows[i].Kecamatan;
              var Phone = rows[i].phone;
              var latitude = rows[i].Latitude;
              var longitude = rows[i].Longitude;
              var usersId = rows[i].usersId;

              ArrayDirection.push({
                'usersId': usersId,
                'Nama': Nama,
                'NamaJalan': NamaJalan,
                'RT': RT,
                'RW': RW,
                'Kelurahan': Kel,
                'Kecamatan': Kec,
                'Phone': Phone,
                'Latitude': latitude,
                'Longitude': longitude,
                'Jarak': Jarak
              })

            }
          }


        }
      }
    })

  })

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