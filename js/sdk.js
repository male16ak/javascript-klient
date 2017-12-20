 let encryption = true;

const SDK = {
  serverURL: "http://localhost:8080/api",
  request: (options, cb) => {

    let headers = {};
    if (options.headers) {
      Object.keys(options.headers).forEach((h) => {
        headers[h] = (typeof options.headers[h] === 'object') ? JSON.stringify(options.headers[h]) : options.headers[h];
      });
    }

    $.ajax({
      url: SDK.serverURL + options.url,
      method: options.method,
      headers: headers,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(SDK.encrypt(JSON.stringify(options.data))),
      success: (data, status, xhr) => {
        cb(null, data, status, xhr);
      },
      error: (xhr, status, errorThrown) => {
        cb({xhr: xhr, status: status, error: errorThrown});
      }
    });

  },
  Courses: {

      findAll: (cb) => {
      SDK.request({
        method: "GET",
        url: "/courses"
      }, (err, data) => {

          if (err) return cb(err);

          data = JSON.parse(data);

          cb(null, data);
      });
    }

  },

  Quiz: {
    create: (data, cb) => {
      SDK.request({
        method: "POST",
        url: "/quiz",
        data: data,

      }, cb);
    },
      findAll: (id, cb) => {
      SDK.request({
        method: "GET",
        url: ("/quiz/"+id),

      }, (err, data) => {

          if (err) return cb(err);

          data = JSON.parse(data);

          cb(null, data);
      });
    },
      delete: (id, cb) => {
          SDK.request({
                  method: "DELETE",
                  url: "/quiz/"+id,

              },

              (err) => {

                  if (err) return cb(err);



                  cb(null);
              });



      }
  },
 // ikke færdig med question
    Question: {
      create: (data, cb) => {
          SDK.request({
              method: "POST",
              url: "/question/"
          }, cb);
      },

        findAll: (id, cb) => {
            SDK.request({
                method: "GET",
                url: ("/question/"+id),

            }, (err, data) => {

                if (err) return cb(err);

                data = JSON.parse(data);

                cb(null, data);
            });
        }

    },


 // ikke færdig med choice
    Choice: {
        findAll: (id, cb) => {
            SDK.request({
                method: "GET",
                url: ("/choice/"+id),

            }, (err, data) => {

                if (err) return cb(err);

                data = JSON.parse(data);

                cb(null, data);
            });
        }



    },

  User: {


      delete: (id, cb) => {
          SDK.request({
              method: "DELETE",
              url: "/user/"+id,
          },
               (err) => {

              if (err) return cb(err);

              cb(null);
          });
      },

      createAdmin: (newAdminUsername, newAdminPassword, newAdminFirstName, newAdminLastName, cb) => {
          SDK.request({
              method: "POST",
              url: "/user",
              data: {
                  username: newAdminUsername,
                  password: newAdminPassword,
                  firstName: newAdminFirstName,
                  lastName: newAdminLastName,
                  type: 2
              },
          }, (err, data) => {

              if (err) return cb(err);


              cb(null, data);
          });

      },


      createUser: (newUsername, newPassword, firstName, lastName, cb) => {
          SDK.request({
              method: "POST",
              url: "/user",
              data: {
                  username: newUsername,
                  password: newPassword,
                  firstName: firstName,
                  lastName: lastName,
                  type: 1
              },
          }, (err, data) => {

              if (err) return cb(err);

              data = JSON.parse(data);

              SDK.Storage.persist("userId", data.userId);
              SDK.Storage.persist("username", data.username);
              SDK.Storage.persist("firstName", data.firstName);
              SDK.Storage.persist("lastName", data.lastName);
              SDK.Storage.persist("type", data.type);

              cb(null, data);
          });

  },

      logOut: () => {

          SDK.Storage.remove("userId");
          SDK.Storage.remove("username");
          SDK.Storage.remove("firstName");
          SDK.Storage.remove("lastName");
          SDK.Storage.remove("CourseId");
          SDK.Storage.remove("QuizID");
          SDK.Storage.remove("type");

          window.location.href = "index.html";
      },

      login: (username, password, cb) => {
          SDK.request({
              url: "/user/login",
              method: "POST",
              data: {
                  username: username,
                  password: password
              },

          }, (err, data) => {

              if (err) return cb(err);

              data = JSON.parse(data);

              SDK.Storage.persist("userId", data.userId);
              SDK.Storage.persist("username", data.username);
              SDK.Storage.persist("firstName", data.firstName);
              SDK.Storage.persist("lastName", data.lastName);
              SDK.Storage.persist("type", data.type);


              cb(null, data);


          });
      },
      current: () => {
          return {
              userId: SDK.Storage.load("userId"),
              username: SDK.Storage.load("username"),
              firstName: SDK.Storage.load("firstName"),
              lastName: SDK.Storage.load("lastName"),
              type: SDK.Storage.load("type")
          }


      },

      findAll: (cb) => {
          SDK.request({
              method: "GET",
              url: "/user"
          }, cb);

      },

    loadNav: (cb) => {
      $("#nav-container").load("nav.html", () => {
        const currentUser = SDK.User.current();
        if (currentUser.userId !== null && currentUser.type == 2 ) {
          $(".navbar-right").html(`
            <li><a href="brugerListe.html">Se Brugerliste</a></li>
            <li><a href="my-page.html">Profile Info</a></li>
          <li><a href="index.html" id="logout-link">Logout</a></li>
          `);
            $(".navbar-left").html("");

        }else if(currentUser.userId !== null) {
            $(".navbar-right").html(`
            <li><a href="my-page.html">Profile Info</a></li>
          <li><a href="index.html" id="logout-link">Logout</a></li>
          `);

            $(".navbar-left").html("");
        }
      else {
          $(".navbar-right").html("");
        }
        $("#logout-link").click(() => SDK.User.logOut());
        cb && cb();
      });
    }
  },
  Storage: {
    prefix: "QuizSDK",
    persist: (key, value) => {
      window.localStorage.setItem(SDK.Storage.prefix + key, (typeof value === 'object') ? JSON.stringify(value) : value)
    },
    load: (key) => {
      const val = window.localStorage.getItem(SDK.Storage.prefix + key);
      try {
        return JSON.parse(val);
      }
      catch (e) {
        return val;
      }
    },
    remove: (key) => {
      window.localStorage.removeItem(SDK.Storage.prefix + key);
    }
  },

    checkLogin:() => {

      if(SDK.Storage.load("userId") == null) {
        try {
            window.stop();
        }
        catch (e) {

            document.execCommand("Stop");
        }
        document.location.replace("index.html");
}

    },


    encrypt: (willBeEncrypted) => {
      if (encryption) {
          if (willBeEncrypted !== undefined && willBeEncrypted.length !== 0) {
              // Encrypt key
              const key = ["K", "O", "C", "H"];
              let nowEncrypted = "";
              for (let i = 0; i < willBeEncrypted.length; i++) {
                  nowEncrypted += (String.fromCharCode((willBeEncrypted.charAt(i)).charCodeAt(0) ^ (key[i % key.length]).charCodeAt(0)))
              }
              return nowEncrypted
          }
      } else{
          return willBeEncrypted
      }
    },

    decrypt: (willBeDecrypted) => {
      if (encryption) {
          if (willBeDecrypted !== undefined && willBeDecrypted.length !== 0) {
              const key = ["K","O","C","H"];
              let nowDecrypted = "";
              for (let i = 0; i < willBeDecrypted.length; i++) {
                  nowDecrypted += (String.fromCharCode((willBeDecrypted.charAt(i)).charCodeAt(0) ^ (key[i % key.length]).charCodeAt(0)))
          }
          return JSON.parse(nowDecrypted);
          }
      } else {
          return JSON.parse(willBeDecrypted)
      }
    }

};