require('dotenv').config()

var description = 
	`
		Authenticator
		
		The Authenticator make you connect to the 42 School API with the Authorization Code flow,
		this step for geting the Access-token That access token is used by the client to make API calls.
		
		Options:
		- "uid"      		:	your 42 application's UID
		- "secret"  		:	your 42 application's SECRET
		- "redirect_uri"  : 	URL to which 42 will redirect the user after granting authorization
	`

class Authenticator {
	constructor(uid, secret, redirect_uri) {
		this.uid = uid
		this.secret = secret
		this.redirect_uri = redirect_uri
	}

	async get_Access_token(code) {
		var payload = {
			grant_type: "authorization_code",
			client_id: this.uid,
			client_secret: this.secret,
			code: code,
			redirect_uri: this.redirect_uri,
		}

		const res =  await fetch(process.env.GET_ACCESS_TOKEN_URL, {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				"Content-Type": "application/json",
			}
		})	
		const data = await res.json()
		return data
	}

	async is_valid_token(access_token) {
		const header = {
			Authorization: `Bearer ${access_token}`,
		};

		var res = await fetch(process.env.TEST_ACCESS_TOKEN, {
			method: "GET",
			headers: header,
		})
		return res.status == 200 ? true : false
	}

	async get_user_data(access_token) {
		const header = {
			Authorization: `Bearer ${access_token}`,
		};

		var res = await fetch(process.env.GET_USER_DATA_URL, {
			method: "GET",
			headers: header,
		})
		return await res.json()
	}
}

module.exports = Authenticator;