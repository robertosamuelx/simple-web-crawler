import express from 'express';
import {Request, Response} from 'express';
import puppeteer from 'puppeteer';

const app = express();

const attributes = [
    { nome: 'Produto' , selector: '#content > div.sc-1d7g5sb-3.jyDaIy > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.sc-1ys3xot-0.h3us20-0.jAHFXn > div.h3us20-5.jTuobL > h1' },
    { nome: 'Preco' , selector: '#content > div.sc-1d7g5sb-3.jyDaIy > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.sc-1ys3xot-0.h3us20-0.cpscHx > div.h3us20-5.kXGTwk > div > div.sc-jTzLTM.sc-ksYbfQ.WCwBE > div.sc-jTzLTM.sc-ksYbfQ.sc-12l420o-0.chjgRM > h2' },
    { nome: 'Descricao' , selector: '#content > div.sc-1d7g5sb-3.jyDaIy > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.sc-1ys3xot-0.h3us20-0.jAHFXn > div.h3us20-5.ccSbwB > div > div.sc-1sj3nln-0.eSLnCp > div > p > span' }
];

async function test(link:string){
    let json_final = {produto:'',preco:'',descricao:''};
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.goto(link);

    const product = await page.$(attributes[0].selector);

    const product_value = await product?.getProperty('textContent');
    const product_txt = await product_value?.jsonValue();

    json_final.produto= String(product_txt);

    const price = await page.$(attributes[1].selector);

    const price_value = await price?.getProperty('textContent');
    const price_txt = await price_value?.jsonValue();

    json_final.preco= String(price_txt);

    const description = await page.$(attributes[2].selector);

    const description_value = await description?.getProperty('textContent');
    const description_txt = await description_value?.jsonValue();

    json_final.descricao= String(description_txt);

    await browser.close();

    //console.log(json_final);

    return json_final;
}

app.get('/', async (req:Request, res:Response) => {
    const link = String(req.header('Link'));
    const result = await test(link);
    return res.json(result);
});

app.listen(3000, () => {console.log('server on')});