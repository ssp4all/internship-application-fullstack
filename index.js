
addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
class ElementHandler {
	constructor(myText) {
		this.myText = myText
	}
	element(element) {
		element.setInnerContent(this.myText)
	}
}
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
	try {
		let response = await fetch('https://cfw-takehome.developers.workers.dev/api/variants');
		let rand = Math.floor(2 * Math.random())
		let data = await response.json();
		let request = new Request(data['variants'][rand])
		let htmlwriter = await fetch(request)
		htmlwriter = new Response(htmlwriter.body, htmlwriter)
		var expiryDate = new Date()
		expiryDate.setDate(expiryDate.getDate() + 4); //expires in 4 days

		htmlwriter = new HTMLRewriter()
			.on('p', new ElementHandler("Hello"))
			.on('a#url', new myURL("href", "https://ssp4all.github.io/"))
			.on('h1', new ElementHandler("Cloudflare challenge 2020"))
			.transform(htmlwriter)
		htmlwriter.headers.append('Set-Cookie', `variant=#1; Secure; Expiry=${expiryDate.toGMTString()}`)

		return htmlwriter
	}
	catch (e) {
		console.log("Err >> " + e)
	}
}

