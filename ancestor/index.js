const fs = require('fs');
const cheerio = require('cheerio')

const getRes = ({html,selectorsArray})=>{
    // we make a list from the selectors and we start from the bottom
    let res = 1;
    let data = fs.readFileSync(html);
    data = data.toString()
    let $ = cheerio.load(data);
    for(var selectors of selectorsArray){
        selectors = selectors.replace(/ /g,'').split('<<').reverse(); 
        //console.log(selectors)

        //initialization
        //reading
        

        let candidates = [];
        $(selectors[0]).each((i,e)=>{
            candidates.push(e)
        })//all the selected divs are possible candidates

        for(var i = 1;i<selectors.length;i++){
            let newcandidates = [];
            let selector = selectors[i];
            let selectorClass ;
            //we check if class
            if(selector.includes('.')){
                selector = selector.split('.')[0]
                selectorClass = selector.split('.')[1]
            }else{
                selectorClass = false;
            }

            for(var candidate of candidates){
                let temp = candidate;
                while(temp.parent){
                    //while a parent exists
                    if(temp.parent.name === selector){
                        // we have a candidate
                        
                        //we check its class
                        if(selectorClass){
                            if(temp.parent.attribs.class && temp.parent.attribs.class.includes(selectorClass))
                            newcandidates.push(temp.parent)
                        }else{
                            newcandidates.push(temp.parent)
                        }
                    }
                    temp = temp.parent; // we keep on exploring
                }
            }


            candidates = newcandidates;

            /*we add some filtering,  
            *JSON'ing the file is a bad idea since structure is circular
            so we use Set
            */
            candidates = new Set(candidates);
            candidates = [...candidates]; // we cast to list
        }

        res = res * candidates.length;
    }
    return res
}


const main = ()=>{
    
    console.log('Test set',getRes({
        html:'test.in',
        selectorsArray:['div << span']
    }))

    console.log('Easy set',getRes({
        html:'easy.in',
        selectorsArray:['div << div']
    }))

    console.log('Medium set',getRes({
        html:'medium.in',
        selectorsArray:['div << span << div','span << div << p','span << div']
    }))

    console.log('Hard set',getRes({
        html:'hard.in',
        selectorsArray : ['span << span','div << span << div','div.zeta << span.alpha << div','span << div.beta << p']
    }))
}

main()