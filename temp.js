addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
//CHALLENGE COMPLETED BY MAULIK SHAH 
//URL: https://maulik-app.fullstack-challenge.workers.dev/

async function handleRequest(request) {
  return fetch('https://cfw-takehome.developers.workers.dev/api/variants') //request to the API
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(res.status);
      }
    })
    .then(res => {
      let urls = res.variants;  //get the urls as an array

      //we need to first check if the user visited the variant
      //initially the person won't, however, we need to check so next time the person goes to the webapp the person will go to the variant that they visited before
      let decision;
      let cookie = request.headers.get('Cookie') //request cookie
      if (cookie && cookie.includes('variant=#1')) {
        decision = true
      } else if(cookie && cookie.includes('variant=#2')) {
        decision = false
      } else {
        decision = (Math.random() < 0.5); //this is for 50/50 chance
      }
      if (decision == true) {
        return fetchVariant(urls[0], decision)
      } else {
        return fetchVariant(urls[1], decision)
      }
    }).catch(error => {
      console.error(error);
    });
}

async function fetchVariant(req, decision) {
  let res = await fetch(req); //request to one of the urls
  var expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + 2); //expires in 2 days
  if(res.ok){ 
    if(decision){ //manipulate the html depending on the variant
      res = new HTMLRewriter()
      .on('p#description', new ElementHandler('Aspiring Software Engineer... I also love to design!'))
      .on('h1#title', new ElementHandler('Cool Challenge #1'))
      .on('a#url', new ElementHandler('My Portfolio'))
      .on('title', new ElementHandler('Heyyy!!'))
      .on('a', new myAttributeHandler('href', 'https://www.mauliks.me/'))
      .transform(res)
      res.headers.append('Set-Cookie', `variant=#1; Secure; Expiry=${expiryDate.toGMTString()}`)
      return res;
    } else {
      res = new HTMLRewriter()
      .on('p#description', new ElementHandler('I love to empower students about tech! '))
      .on('h1#title', new ElementHandler('Cool Challenge #2'))
      .on('a#url', new ElementHandler('My Linkedin'))
      .on('title', new ElementHandler('Yayyy!!'))
      .on('a', new myAttributeHandler('href', 'https://www.linkedin.com/in/maulikshah87/'))
      .transform(res)
      res.headers.append('Set-Cookie', `variant=#2; Secure; Expiry=${expiryDate.toGMTString()}`)
      return res;
    }
  } else {
    throw new Error(res.status);
  }
}

class ElementHandler {
  constructor(myText) {
    this.myText = myText
  }
  element(element) {
    element.setInnerContent(this.myText)
  }
}

class myAttributeHandler{
  constructor(attributeName, link){
    this.attributeName = attributeName
    this.link = link
  }
  element(element){
    const attribute = element.getAttribute(this.attributeName)
    if (attribute) {
      element.setAttribute(
        this.attributeName,
        attribute.replace('https://cloudflare.com', this.link),
      )
    }
  }
}