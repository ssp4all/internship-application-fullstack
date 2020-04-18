
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
	
	return fetch('https://cfw-takehome.developers.workers.dev/api/variants') //request to the API
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
		if (cook && cook.includes('var-1')){
			return showVar(url[0], 1)
		} 
		else if(cook && cook.includes('var-2')) {
			return showVar(url[1], 2)
		}
		else{
			let rand = Math.floor(2 * Math.random())
			return showVar(url[rand], rand)
		}
	}).catch (error => {
		console.log("Err >> " + error)
	});
}

async function showVar(url, dec){
	let ans = await fetch(url)
	var expiryDate = new Date()
	expiryDate.setDate(expiryDate.getDate() + 1); //expires in 4 days

	// htmlwriter = new Response(htmlwriter.body, htmlwriter)
	if (ans.ok){
		if (dec == 1){
			ans = new HTMLRewriter()
				.on('p#description', new ElementHandler("Hello"))
				.on('h1#title', new ElementHandler("WELCOME"))
				.on('a#url', new myURL("My Portfolio"))
				.on('a', new myURL("href", "https://ssp4all.github.io/"))
				.on('h1', new ElementHandler("Cloudflare challenge 2020"))
				.transform(ans)
			ans.headers.append('Set-Cookie', `var-1; Secure; Expiry=${expiryDate.toGMTString()}`)
		
			return ans;
		}
		else{
			ans = new HTMLRewriter()
				.on('p#description', new ElementHandler("Hello"))
				.on('h1#title', new ElementHandler("WELCOME"))
				.on('a#url', new myURL("My GITHUB"))
				.on('a', new myURL("href", "https://github.com/ssp4all"))
				.on('h1', new ElementHandler("Cloudflare challenge 2020"))
				.transform(ans)
			ans.headers.append('Set-Cookie', `var-2; Secure; Expiry=${expiryDate.toGMTString()}`)

			return ans;
		}
	}
	else{
		throw new Error(">> "+e)
	}
}