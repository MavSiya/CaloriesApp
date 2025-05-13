import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';


pdfMake.vfs = pdfFonts.vfs; 

export function generatePdfForMenuAndShoppingList({ menu, aggregatedIngredients }) {
  const docDefinition = {
    content: [
      { text: 'Меню на тиждень', style: 'header' },
      ...generateMenuContent(menu),
      { text: 'Список продуктів для покупки', style: 'subheader' },
      ...generateShoppingListContent(aggregatedIngredients),
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      text: {
        fontSize: 12,
        margin: [0, 5, 0, 5],
      },
       lightGreenHeader: {
      fontSize: 12,
      bold: true,
      fillColor: '#D0F7D4', // Светло-зеленый цвет
      alignment: 'center',
      margin: [0, 5, 0, 5],
    },
    },
  };

  // Генерация PDF
  pdfMake.createPdf(docDefinition).download('Меню_і_список_продуктів.pdf');
}

function generateMenuContent(menu) {
  const weekDays = [
    { key: 'monday', name: 'Понеділок' },
    { key: 'tuesday', name: 'Вівторок' },
    { key: 'wednesday', name: 'Середа' },
    { key: 'thursday', name: 'Четвер' },
    { key: 'friday', name: 'П’ятниця' },
    { key: 'saturday', name: 'Субота' },
    { key: 'sunday', name: 'Неділя' }
  ];

  const mealTypes = ['Сніданок', 'Обід', 'Вечеря', 'Перекус'];

  const menuContent = [];

  weekDays.forEach(day => {
    menuContent.push({ text: day.name, style: 'subheader' });

    const dayMenu = menu.filter(item => item.day === day.key);

    // Групуємо страви по прийому їжі
    const groupedByMeal = {
      'Сніданок': [],
      'Обід': [],
      'Вечеря': [],
      'Перекус': []
    };

    dayMenu.forEach(dish => {
      const meal = dish.meal || dish.typeOfMeal || 'Невідомо';
      const dishTitle = dish.dishTitle || dish.ingredientTitle || 'Назва відсутня';

      if (groupedByMeal[meal]) {
        groupedByMeal[meal].push(dishTitle);
      }
    });

    // Формуємо таблицю на день
    const table = {
      table: {
        widths: ['*', '*', '*', '*'],
        body: [
         mealTypes.map(meal => ({ text: meal, style: 'lightGreenHeader' })), 
          mealTypes.map(meal => groupedByMeal[meal].join(', ') || '-') // Вміст
        ]
      },
      style: 'text',
      margin: [0, 0, 0, 10]
    };

    menuContent.push(table);
  });

  return menuContent;
}


function generateShoppingListContent(aggregatedIngredients) {
  return aggregatedIngredients.map(ingredient => ({
    columns: [
      {
        width: 'auto', // Размер чекбокса
        stack: [
          {
            canvas: [
              {
                type: 'rect',
                x: 0,
                y: -2,
                w: 10,
                h: 10,
                lineWidth: 1,
                lineColor: 'black',
                fillColor: 'white',
              },
            ],
          },
        ],
        margin: [0, 8, 5, 0], // Отступы между чекбоксом и текстом
      },
      {
        text: `${ingredient.title}: ${ingredient.totalWeight} г`,
        style: 'text',
      },
    ],
    style: 'text',
    margin: [0, 5, 0, 5], // Отступы между строками
  }));
}

