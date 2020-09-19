const Post_WIDTH = 3.5;
const BOARD_LENGTH = 8 * 12;
const WASTE_MULTIPLIER = 0.1;
const STUDS_OFFSET = 16;

// Posts are required every 20 feet at minimum
const Posts_REQUIRED_EVERY_INCHES = 20 * 12;
const FULL_BOARDS_IN_SECTION = Math.floor(
    Posts_REQUIRED_EVERY_INCHES / BOARD_LENGTH
);
const FULL_BOARD_SECTION_SIZE = FULL_BOARDS_IN_SECTION * BOARD_LENGTH;

function convertFeetToInches(feet: number) {
    return feet * 12;
}

function getPlatesInLength(inches: number) {
    // devide the length by 96 inches (8 feet) and round up
    // multiply by two because we're doing the top and bottom in one calculation
    return Math.ceil(inches / BOARD_LENGTH) * 2;
}

function getStudsInLength(inches: number) {
    // calculate the studs across
    // round up to account for the last one
    const studs = Math.ceil(inches / STUDS_OFFSET);

    // make sure we add an end piece if we have a perfect multiple of 16
    const isNotPerfectWidth = Math.min(inches % STUDS_OFFSET, 1);
    const perfectWidthExtension = isNotPerfectWidth * -1 + 1;
    return studs + perfectWidthExtension;
}

function getBoardsInLength(inches: number): number {
    const plates = getPlatesInLength(inches);
    const studs = getStudsInLength(inches);

    return plates + studs;
}

function getRequiredPostsInLength(inches: number) {
    // for every 20 feet, we need one post
    // we know our wall is at least 20 feet, so calculate the required posts for the REST of the wall
    // if our wall is under 20 feet, this will return zero
    const wallLengthOverMinRequired = getWallLengthOverMinimumRequiredBeforePost(
        inches
    );
    const wallLengthPlusPost = Posts_REQUIRED_EVERY_INCHES + Post_WIDTH;
    const requiredPosts = Math.ceil(
        wallLengthOverMinRequired / wallLengthPlusPost
    );

    return requiredPosts;
}

function getWallLengthOverMinimumRequiredBeforePost(inches: number): number {
    return Math.max(inches - Posts_REQUIRED_EVERY_INCHES, 0);
}

// any number of inches past Posts_REQUIRED_EVERY_INCHES will return 1
// any number of inches below or equal to Posts_REQUIRED_EVERY_INCHES return 0
function isPostRequired(inches: number): number {
    // negative numbers are zero
    const wallLengthOverMinRequired = Math.max(
        inches - Posts_REQUIRED_EVERY_INCHES,
        0
    );

    // remove decimals
    const wholeNumber = Math.ceil(wallLengthOverMinRequired);

    // returns 1 (at least one post required ) or 0 (no Posts required)
    const isPostRequired = Math.min(wholeNumber, 1);

    return isPostRequired;
}

function getFullSections(inches: number, Posts: number) {
    // how many inches will we remove from a section between posts to get to the last full board
    const inchesReducedPerSection =
        Posts_REQUIRED_EVERY_INCHES - FULL_BOARD_SECTION_SIZE;

    // how big is the last section if all posts are at Posts_REQUIRED_EVERY_INCHES
    const lastSectionSize =
        inches - Posts * (Posts_REQUIRED_EVERY_INCHES + Post_WIDTH);

    // how many inches of boards can we add to the last section before it will add an additional post to the structure
    const remainingBeforeNewPost =
        Posts_REQUIRED_EVERY_INCHES - lastSectionSize;

    // how many complete portions of the inchesReducedPerSection can we move to the last section
    let fullSections = Math.floor(
        remainingBeforeNewPost / inchesReducedPerSection
    );

    // even if we can FIT fullSections moved into the last portion, we might not HAVE them in our length
    fullSections = Math.min(fullSections, Posts);

    // safeguard inches not requiring a post and return value
    fullSections = fullSections * isPostRequired(inches);

    return fullSections;
}

function getLastSectionSize(inches: number, Posts: number) {
    const fullSections = getFullSections(inches, Posts);
    const lastSectionSize =
        inches - Posts * Post_WIDTH - fullSections * FULL_BOARD_SECTION_SIZE;

    return lastSectionSize;
}

function buildWall(inches: number) {
    // get required posts
    const requiredPosts = getRequiredPostsInLength(inches);
    const fullSections = getFullSections(inches, requiredPosts);
    const lastSectionSize = getLastSectionSize(inches, requiredPosts);
    const studs =
        getBoardsInLength(FULL_BOARD_SECTION_SIZE) * fullSections +
        getBoardsInLength(lastSectionSize);

    return {
        function: "buildWall",
        studs: studs,
        PostsTotal: requiredPosts,
    };
}

function accountForWaste(items: number): number {
    const waste = Math.ceil(items * WASTE_MULTIPLIER);
    return waste + items;
}

export function calculateHouseRequirements(
    widthInFeet: number,
    lengthInFeet: number
) {
    // convert feet to inches
    const outerWidthOfHouse = convertFeetToInches(widthInFeet);
    const outerLengthOfHouse = convertFeetToInches(lengthInFeet);

    // calculate the space inbetween corner posts
    const innerWidthOfHouse = outerWidthOfHouse - Post_WIDTH * 2;
    const innerLengthOfHouse = outerLengthOfHouse - Post_WIDTH * 2;

    const wall1 = buildWall(innerWidthOfHouse);
    const wall2 = buildWall(innerLengthOfHouse);

    const studs = accountForWaste((wall1.studs + wall2.studs) * 2);
    const PostsTotal = accountForWaste((wall1.PostsTotal + wall2.PostsTotal) * 2 + 4);

    return {
        studs: studs,
        PostsTotal: PostsTotal,
    };
}
