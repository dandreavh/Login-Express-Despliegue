var express = require('express');
var LdapAuth= require('ldapauth-fork');
const { use } = require('.');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

// Configuración del administrador del LDAP
var ldap = new LdapAuth({
  url: 'ldap://localhost:389', // puerto de acceso 
  bindDN: 'uid=admin,dc=iesalixar,dc=org', // nombre del administrador y organización
  bindCredentials: 'passiesalixar', // contraseña del administrador
  searchBase: 'ou=alumnos,dc=iesalixar,dc=org', // filtra la unidad organizativa
  searchFilter: '(uid={{username}})', // captura el uid del usuario capturado
  reconnect: true,
});

router.post('/auth', (req, res) => {
  // capturo del cuerpo el nombre del usuario y la contraseña
  const username = req.body.username;
  const password = req.body.password;
  ldap.authenticate(username, password, function (err, user) {
    if(err){
      return res.redirect("/login");
    } else{
      return `UID: ${user.uid} DN: ${user.dn}`;
    }
  });
}); 
module.exports = router;