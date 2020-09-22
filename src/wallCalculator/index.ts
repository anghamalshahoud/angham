const postsWidth = 3.5;
const spaceApart = 16;
const extraMultiplayer = 0.1;
const BoardLength = 8 * 12;

// Posts are required every 20 feet at minimum
const Posts_requiered_everyInches = 20 * 12;
const FullBoardInSection = Math.floor( Posts_requiered_everyInches / BoardLength);
const FullBoardSectionSize = FullBoardInSection * BoardLength;

function feetintoinches(feet: number) {
    // this function will convert feet into inches.
    return feet * 12;
}

function top_bottom_plates(inches: number) {
    // this function will calculate the number of plates needed.

    let top_plates = Math.ceil(inches / BoardLength) + Math.ceil(inches / BoardLength);

    // calculation for the bottom plates.

    let bottom_plates = Math.ceil(inches / BoardLength);

    return bottom_plates + top_plates;
}



function studsInLength(inches: number) {
    // calculate the studs across
    // round up to account for the last one

    const studs = Math.ceil(inches / spaceApart);

    // make sure we add an end piece if we have a perfect multiple of 16.

    const isNotPerfectWidth = Math.min(inches % spaceApart, 1);
    const perfectWidthExtension = isNotPerfectWidth * -1 + 1;
    return studs + perfectWidthExtension;
}


function getWallLengthOverMinimumRequiredBeforePost(inches: number): number {
    return Math.max(inches - Posts_requiered_everyInches, 0);
}

function getRequiredPostsInLength(inches: number) {
    // for every 20 feet, we need one post
    // we know our wall is at least 20 feet, so calculate the required posts for the REST of the wall
    // if our wall is under 20 feet, this will return zero

    const wallLengthOverMinRequired = getWallLengthOverMinimumRequiredBeforePost(
        inches
    );
    const wallLengthPlusPost = Posts_requiered_everyInches + postsWidth;
    const requiredPosts = Math.ceil(
        wallLengthOverMinRequired / wallLengthPlusPost
    );

    return requiredPosts;
}

function isPostRequired(inches: number): number {
    // any number of inches past Posts_requiered_everyInches will return 1
    // any number of inches below or equal to Posts_requiered_everyInches return 0

    // negative numbers are zero
    const wallLengthOverMinRequired = Math.max(
        inches - Posts_requiered_everyInches,
        0
    );

    // remove decimals
    const wholeNumber = Math.ceil(wallLengthOverMinRequired);

    // returns 1 (at least one post required ) or 0 (no posts required)
    const isPostRequired = Math.min(wholeNumber, 1);

    return isPostRequired;
}

function getFullSections(inches: number, posts: number) {
    // how many inches will we remove from a section between posts to get to the last full board
    const inchesReducedPerSection =
        Posts_requiered_everyInches - FullBoardSectionSize;

    // how big is the last section if all posts are at Posts_requiered_everyInches
    const lastSectionSize =
        inches - posts * (Posts_requiered_everyInches + postsWidth);

    // how many inches of boards can we add to the last section before it will add an additional post to the structure
    const remainingBeforeNewPost =
        Posts_requiered_everyInches - lastSectionSize;

    // how many complete portions of the inchesReducedPerSection can we move to the last section
    let fullSections = Math.floor(
        remainingBeforeNewPost / inchesReducedPerSection
    );

    // even if we can FIT fullSections moved into the last portion, we might not HAVE them in our length
    fullSections = Math.min(fullSections, posts);

    // safeguard inches not requiring a post and return value
    fullSections = fullSections * isPostRequired(inches);

    return fullSections;
}

function getLastSectionSize(inches: number, posts: number) {
    const fullSections = getFullSections(inches, posts);
    const lastSectionSize =
        inches - posts * postsWidth - fullSections * FullBoardSectionSize;

    return lastSectionSize;
}

function buildWall(inches: number) {
    // get required posts
    const requiredPosts = getRequiredPostsInLength(inches);
    const fullSections = getFullSections(inches, requiredPosts);
    const lastSectionSize = getLastSectionSize(inches, requiredPosts);
    const studs = studsInLength(FullBoardSectionSize) * fullSections + studsInLength(lastSectionSize);
    const plates = top_bottom_plates(FullBoardSectionSize) * fullSections + top_bottom_plates(lastSectionSize);

    return {
        function: "buildWall",
        inches,
        studs: studs,
        plates: plates,
        posts: requiredPosts,
    };
}

function accountForWaste(items: number): number {
    const waste = Math.ceil(items * extraMultiplayer);
    return waste + items;
}

export function calculateHouseRequirements(widthInFeet: number,Inches: number) {
    // convert feet to inches
    const outerWidthOfHouse = (feetintoinches(widthInFeet)) + Inches

    // calculate the space inbetween corner posts
    const innerWidthOfHouse = outerWidthOfHouse - postsWidth * 2;
   

    const wall1 = buildWall(innerWidthOfHouse);

    const studs = accountForWaste((wall1.studs));
    const posts = accountForWaste(wall1.posts);

    const plates = accountForWaste(wall1.plates);

    return {
        studs: studs,
        posts: posts,
        plates: plates,
    };
}
