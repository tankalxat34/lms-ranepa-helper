/**
 * @description cookies worker for lms ranepa helper
 */


class Cookie {
    constructor(doccok = document.cookie) {
        this.dc = doccok;
        this.obj = new Object();
        this.parse()
    }

    parse() {
        this.dc.split(";").forEach(element => {
            let key = element.split("=")[0].trim()
            let value = element.split("=")[1].trim()

            this.obj[key] = value
        });
        return this.obj
    }

    set_value(key, value) {
        document.cookie = `${key}=${value}; max-age=31536000; path=/`
        this.obj = this.parse()
        return this.obj
    }

    rm(key) {
        delete this.obj[key]
        return this.obj
    }
}


// console.log(document.cookie)

// console.log(document.cookie.concat("; name=tankalxat34"))

c = new Cookie()

console.log(c)

console.log(c.obj)
// console.log(c.set_value("name", "tankalxat34"))