export const getCategoryName = (category: string): string => {
    const categoryMap = {
        electronics: 'Electronics',
        clothing: 'Clothing & Accessories',
        books: 'Books & Media',
        home: 'Home & Garden',
    };
    return categoryMap[category] || category;
};

export const generateTags = (name: string, description: string): string[] => {
    const text = `${name} ${description}`.toLowerCase();
    return text
        .split(' ')
        .filter((word) => word.length > 3)
        .filter((word, index, array) => array.indexOf(word) === index) // Remove duplicates
        .slice(0, 10); // Limit to 10 tags
};
