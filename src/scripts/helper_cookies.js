/**
 * @description cookies worker for lms ranepa helper
 */


class Cookie {
    constructor(doccok = document.cookie) {
        this.dc = doccok;
        this.obj = new Object();
        this.parse();
    }

    parse() {
        this.dc.split(";").forEach(element => {
            let key = element.split("=")[0].trim();
            let value = element.split("=")[1].trim();

            this.obj[key] = value;
        });
        return this.obj;
    }

    set_value(key, value) {
        document.cookie = `${key}=${value}; max-age=31536000; path=/`;
        this.obj = this.parse();
        return this.obj;
    }

    rm(key) {
        delete this.obj[key];
        return this.obj;
    }
}



_c = new Cookie();