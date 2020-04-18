// Name: Suraj Pawar

addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
class myURL {
	constructor(attributeName, link) {
		this.attributeName = attributeName
		this.link = link
	}
	element(element) {
		const attribute = element.getAttribute(this.attributeName)
		if (attribute) {
			element.setAttribute(
				this.attributeName,
				attribute.replace('https://cloudflare.com', this.link),
			)
		}
	}
}

async function handleRequest(request) {
	// To handle incoming requests
	return fetch('https://cfw-takehome.developers.workers.dev/api/variants')
		.then(data => {
			if (data.ok) {
				return data.json();
			} else {
				throw new Error(data.status);
			}
		})
		.then(data => {
			let url = data.variants;
			// cookies
			let cook = request.headers.get('Cookie')
			if (cook && cook.includes('var-1')) {
				return showVar(url[0], 1)
			}
			else if (cook && cook.includes('var-2')) {
				return showVar(url[1], 0)
			}
			else {
				//No cookie
				let rand = Math.random()
				if (rand < 0.5)
					// rand = 0
					return showVar(url[0], 0)
				else
					return showVar(url[1], 1)
			}
		}).catch(error => {
			console.log("Err >> " + error)
		});
}

async function showVar(url, dec) {
	let ans = await fetch(url)
	var expiryDate = new Date()
	expiryDate.setDate(expiryDate.getDate() + 1); //expires in 4 days

	// htmlwriter = new Response(htmlwriter.body, htmlwriter)
	if (ans.ok) {
		// console.log(dec)
		if (dec) {
			ans = new HTMLRewriter()
				.on('p#description', new addDetails("CLICK ON THIS LINK"))
				.on('h1#title', new addDetails("WELCOME"))
				.on('a#url', new addDetails("My Portfolio"))
				.on('title', new addDetails("First"))
				.on('a', new myURL("href", "https://ssp4all.github.io/"))
				.on('h1', new addDetails("Cloudflare challenge 2020-1"))
				.transform(ans)
			ans.headers.append('Set-Cookie', `var-1; Secure; Expiry=${expiryDate.toGMTString()}`)

			return ans;
		}
		else {
			ans = new HTMLRewriter()
				.on('p#description', new addDetails("CLICK ON THIS LINK"))
				.on('h1#title', new addDetails("WELCOME"))
				.on('a#url', new addDetails("My GITHUB"))
				.on('title', new addDetails("second"))
				.on('a', new myURL("href", "https://github.com"))
				.on('h1', new addDetails("Cloudflare challenge 2020-2"))
				.transform(ans)
			ans.headers.append('Set-Cookie', `var-2; Secure; Expiry=${expiryDate.toGMTString()}`)

			return ans;
		}
	}
	else {
		throw new Error("Error >> " + e)
	}
}
class addDetails {
	constructor(myText) {
		this.myText = myText
	}
	element(element) {
		element.setInnerContent(this.myText)
	}
}