function wrapText(str, max) {
  let words = str.split(' '),
    lines = [],
    line = 0,
    lineLength = 0;

  words.forEach(word => {
    if (lineLength + word.length + 1 > max) {
      line += 1
      lineLength = 0;
    } else {
      lineLength += 1;
    }
    lines[line] = lines[line] || [];
    lines[line].push(word);
    lineLength += word.length;
  });

  return lines.map(line => line.join(' ')).join('\n');
};

export default class QuestionManager {
  constructor() {
    console.log('questionmanager created')
    this.question = null;
    this.answers = [null, null, null];
    this.xOffset = 0;
    this.width = 400 - this.xOffset;
    this.yOffset = 16;
    this.yStart = 48;
    this.yDiff = 48;
    this.colors = ['0x557d55', '0xca5954', '0x5c699f']

  }
  preload(phaser) {
    phaser.load.bitmapFont('font', 'fonts/font.png', 'fonts/font.fnt');
    phaser.load.json('questions');
  }

  create(phaser) {
    const testText = phaser.add.bitmapText(-20, -20, "font", "AB");
    this.maxLetters = this.width / (testText.getTextBounds().global.width / 2);

    this.questions = phaser.cache.json.get('questions').map(question => {
      question.correct = question.answers.findIndex(answer => answer == question.correct);
      return question;
    });
    this.questionIndex = Math.floor(Math.random() * this.questions.length);

    this.question = phaser.add.bitmapText(0, this.yOffset, 'font', wrapText(this.questions[this.questionIndex].question, this.maxLetters));
    for (let i = 0; i < 3; i++) {
      this.answers[i] = phaser.add.bitmapText(this.xOffset, this.yStart + this.yDiff * i + this.yOffset, 'font', wrapText(this.questions[this.questionIndex].answers[i], this.maxLetters));
      this.answers[i].setTint(this.colors[i]);
    }
  }

  newQuestion() {
    this.questionIndex = Math.floor(Math.random() * this.questions.length);
    this.question.setText(wrapText(this.questions[this.questionIndex].question, this.maxLetters));
    for (let i = 0; i < 3; i++) {
      this.answers[i].setText(wrapText(this.questions[this.questionIndex].answers[i], this.maxLetters));
    }
  }
}