const generateRatingPoints = (input) => {
    const [numerator, denominator] = input.split('/').map(Number);
    console.log(numerator, denominator);

    // Set the default points amount for rating a book ...
    let points = 0.1;

    const newNumerator = numerator + points;
    // set the reating points string ...
    const newRating = `${newNumerator}/${denominator}`;
    return newRating;
} 

module.exports = { generateRatingPoints };