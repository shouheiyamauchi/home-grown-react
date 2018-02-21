const update = require('immutability-helper');
const MaterialYoutube = require('./models/MaterialYoutube');
const MaterialText = require('./models/MaterialText');
const MaterialMultipleChoiceQuestion = require('./models/MaterialMultipleChoiceQuestion');
const LessonMaterial = require('./models/LessonMaterial');
const Lesson = require('./models/Lesson');
const CategoryLesson = require('./models/CategoryLesson');
const Category = require('./models/Category');
const CategoryRelationship = require('./models/CategoryRelationship');

const MockDatabase = {
  categoryWithAllChildren: function(categoryId) {
    const categoryWithAllChildren = this.findCategory(categoryId);

    categoryWithAllChildren.categories = this.findCategoryChildren(categoryId);
    // get child categories of child categories
    categoryWithAllChildren.categories.map((childCategory, index) => categoryWithAllChildren.categories[index] = this.categoryWithAllChildren(childCategory.id));

    categoryWithAllChildren.lessons = this.findCategoryLessons(categoryId);
    // get materials of lessons
    categoryWithAllChildren.lessons.map((categoryLesson, index) => categoryWithAllChildren.lessons[index].materials = this.findLessonMaterials(categoryLesson.id));

    return categoryWithAllChildren;
  },
  findMaterial: function(materialProps) {
    const { material_type, material_id } = materialProps;

    const MaterialModel = {
      MaterialYoutube: MaterialYoutube,
      MaterialText: MaterialText,
      MaterialMultipleChoiceQuestion: MaterialMultipleChoiceQuestion
    }[material_type];

    // add material type to object
    return update(MaterialModel.find(material => material.id === material_id), {materialType: { $set: material_type }});
  },
  findMaterialsByMaterialPropsArray: function(materialPropsArray) {
    const materialsArray = [];
    // don't use Array.filter to retain order
    materialPropsArray.forEach(materialProps => materialsArray.push(this.findMaterial(materialProps)));

    return materialsArray;
  },
  findLessonMaterials: function(lessonId) {
    const lessonMaterialObjects = LessonMaterial.filter(lessonMaterial => lessonMaterial.lesson_id === lessonId);
    // sort by index property
    const sortedlessonMaterialObjects = lessonMaterialObjects.sort((a, b) => a.index - b.index);
    const lessonMaterialProps = sortedlessonMaterialObjects.map(lessonMaterialObject => {
      return { material_type: lessonMaterialObject.material_type, material_id: lessonMaterialObject.material_id };
    });

    return this.findMaterialsByMaterialPropsArray(lessonMaterialProps);
  },
  findLesson: function(id) {
    return Lesson.find(lesson => lesson.id === id);
  },
  findLessonsByIdArray: function(idArray) {
    const lessonsArray = [];
    // don't use Array.filter to retain order
    idArray.forEach(id => lessonsArray.push(this.findLesson(id)));

    return lessonsArray;
  },
  findCategory: function(id) {
    return Category.find(category => category.id === id);
  },
  findCategoriesByIdArray: function(idArray) {
    const categoriesArray = [];
    // don't use Array.filter to retain order
    idArray.forEach(id => categoriesArray.push(this.findCategory(id)));

    return categoriesArray;
  },
  findCategoryChildren: function(categoryId) {
    const categoryRelationshipObjects = CategoryRelationship.filter(categoryRelationship => categoryRelationship.parent_category_id === categoryId);
    // sort by index property
    const sortedCategoryRelationshipObjects = categoryRelationshipObjects.sort((a, b) => a.index - b.index);
    const childCategoryIds = sortedCategoryRelationshipObjects.map(categoryRelationshipObject => categoryRelationshipObject.child_category_id);

    return this.findCategoriesByIdArray(childCategoryIds);
  },
  findCategoryLessons: function(categoryId) {
    const categoryLessonObjects = CategoryLesson.filter(lessonCategory => lessonCategory.category_id === categoryId);
    // sort by index property
    const sortedCategoryLessonObjects = categoryLessonObjects.sort((a, b) => a.index - b.index);
    const categoryLessonIds = sortedCategoryLessonObjects.map(categoryLessonObject => categoryLessonObject.lesson_id);

    return this.findLessonsByIdArray(categoryLessonIds);
  }
};

module.exports = MockDatabase;
