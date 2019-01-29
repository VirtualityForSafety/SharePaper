//import {parseBibFile, normalizeFieldValue} from "bibtex";
const bibtex = require('bibtex');

module.exports = {
  update: function (){ //paperId, rawBibTex) {


    const bibFile = bibtex.parseBibFile(`
      @article{Owens_2015, title={SimSup’s Loop: A control theory approach to spacecraft operator training}, ISBN={9781479953806}, url={http://dx.doi.org/10.1109/aero.2015.7118921}, DOI={10.1109/aero.2015.7118921}, journal={2015 IEEE Aerospace Conference}, publisher={IEEE}, author={Owens, Brandon D. and Crocker, Alan R.}, year={2015}, month={Mar}}

    `);
    console.log(bibFile['content'][1]['_id']);
    console.log(bibFile._id);
    const entry = bibFile
      .getEntry("Owens_2015") // Keys are case-insensitive

    const fieldValue = entry
      .getField("title"); // This is a complex BibTeX string

    console.log(
        // But we can normalize to a JavaScript string
        bibtex.normalizeFieldValue(fieldValue)
    );

    const authorField = entry
      .getField("author"); // This is a special object, divided into first names, vons and last names according to BibTeX spec

    authorField.authors$.map((author, i) => console.log("Author: "
      + (author.firstNames
                .concat(author.vons)
                .concat(author.lastNames)
                .concat(author.jrs)).join(" ")));
  }
};
