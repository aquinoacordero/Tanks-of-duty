"use strict";
var mysql = require('mysql');

class usuario {
    constructor(nombre, mysqlconnect) {
            this._nombre = nombre;
            this._mysqlconnection = mysqlconnect;
            this._id = null;
            this._provider = "local";
            this._foto = 'https://avatars1.githubusercontent.com/u/20266135?v=3&s=460';
            this._password = null;
            this._email = null;
            this._idtabla;
            this._newPassword;
        }
        // ---- Getters ------ //
    get nombre() {
        return this._nombre;
    }
    get id() {
        return this._id;
    }
    get provider() {
        return this._provider;
    }
    get foto() {
        return this._foto;
    }
    get password() {
        return this._password;
    }
    get email() {
        return this._email;
    }
    get idtabla() {
        return this._idtabla;
    }

    // ---- Setters ------ //
    set local(objeto) {
        this._password = objeto.password;
        this._email = objeto.email;
    }
    set oneClickLogin(objeto) {
        this._id = objeto.id;
        this._provider = objeto.provider;
        this._foto = objeto.foto;
    }
    set foto(foto) {
        this._foto = foto;
    }
    set newPassword(value) {
        this._newPassword = value;
    }
    set password(value) {
        this._password = value;
    }

    // ---- Funciones ------ //
    // // const sql = 'INSERT INTO usuarios.usuario (IDred, username, provider, photo, password, email) VALUES ("' + this._id + '", "' + this._nombre + '", "' + this._provider + '", "' + this._foto + '", "' + this._password + '", "' + this._correo + '");';
    OneClick(cb) {
        let IDred = this._id + this._provider[0];
        const comprobar = 'SELECT ID FROM usuarios.usuario where IDred = "' + IDred + '"';
        const insertar = 'INSERT INTO usuarios.usuario (IDred, username, provider, photo) VALUES ("' + IDred + '", "' + this._nombre + '", "' + this._provider + '", "' + this._foto + '");';
        let cliente = mysql.createConnection(this._mysqlconnection);
        cliente.connect((err) => {
            if (err) {
                return cb(err, 2);
            }
            cliente.query(comprobar, (err, rows) => {
                if (err) {
                    return cb(err, 2);
                } else if (rows.length) {
                    cliente.end();
                    return cb(err, 1, rows[0].ID);
                } else {
                    cliente.query(insertar, (err) => {
                        if (err) {
                            return cb(err, 2);
                        } else {
                            cliente.query(comprobar, (err,rows) => {
                                if (err) {
                                    return cb(err, 2);
                                } else {
                                    return cb(err, 1, rows[0].ID);
                                }
                            });
                        }
                    });
                }
            });
        });
    }
    registrarLocal(cb) {
        const comprobar = 'SELECT * FROM usuarios.usuario where username = "' + this._nombre + '" and provider = "local"';
        const insertar = 'INSERT INTO usuarios.usuario (username, provider, password, email) VALUES ("' + this._nombre + '", "' + this._provider + '", "' + this._password + '", "' + this._email + '");';
        let cliente = mysql.createConnection(this._mysqlconnection);
        cliente.connect((err) => {
            if (err) {
                return cb(err, 2);
            }
            cliente.query(comprobar, (err, rows) => {
                if (err) {
                    return cb(err, 2);
                } else if (rows.length) {
                    cliente.end();
                    return cb(err, 1);
                } else {
                    cliente.query(insertar, (err) => {
                        cliente.end();
                        if (err) {
                            return cb(err, 2);
                        } else {
                            return cb(err, 0);
                        }
                    });
                }
            });
        });
    }
    logLocal(cb) {
        const comprobar = 'SELECT ID FROM usuarios.usuario where username = "' + this._nombre + '" and provider = "local" and password="' + this._password + '"';
        let cliente = mysql.createConnection(this._mysqlconnection);
        cliente.connect((err) => {
            if (err) {
                return cb(err, 2);
            }
            cliente.query(comprobar, (err, rows) => {
                cliente.end();
                if (err) {
                    return cb(err, 2);
                } else if (rows.length) {
                    return cb(err, 0, rows[0].ID);
                } else {
                    return cb(err, 1)
                }
            });
        });
    }
}
module.exports = usuario;