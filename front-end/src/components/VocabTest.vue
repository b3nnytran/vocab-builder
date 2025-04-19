<!-- src/components/VocabTest.vue -->
<template>
  <div>
    <h2>Score: {{ score }} out of {{ totalQuestions }}</h2>

    <div class="ui segment" v-if="!testStarted">
      <h3>Test Settings</h3>
      <div class="ui form">
        <div class="field">
          <label>Test From:</label>
          <select v-model="testFrom" class="ui dropdown">
            <option value="" disabled>Select language to test from</option>
            <option value="german">German</option>
            <option value="english">English</option>
            <option value="spanish">Spanish</option>
          </select>
        </div>
        
        <div class="field">
          <label>Test To:</label>
          <select v-model="testTo" class="ui dropdown">
            <option value="" disabled>Select language to test to</option>
            <option value="german">German</option>
            <option value="english">English</option>
            <option value="spanish">Spanish</option>
          </select>
        </div>
        
        <button class="ui primary button" @click="startTest" :disabled="!canStartTest">
          Start Test
        </button>
      </div>
    </div>

    <form v-if="testStarted" action="#" @submit.prevent="onSubmit">
      <div class="ui labeled input fluid">
        <div class="ui label">
          <i :class="[fromFlagClass]"></i> {{ getLanguageName(testFrom) }}
        </div>
        <input type="text" readonly :disabled="testOver" :value="currWord[testFrom]"/>
      </div>
      <div class="ui labeled input fluid">
        <div class="ui label">
          <i :class="[toFlagClass]"></i> {{ getLanguageName(testTo) }}
        </div>
        <input type="text" placeholder="Enter word..." v-model="userAnswer" :disabled="testOver" autocomplete="off" />
      </div>

      <button class="positive ui button" :disabled="testOver">Submit</button>
    </form>

    <p :class="['results', resultClass]" v-if="result">
      <span v-html="result"></span>
    </p>
  </div>
</template>

<script>
export default {
  name: 'vocab-test',
  props: {
    words: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      randWords: [],
      incorrectGuesses: [],
      result: '',
      resultClass: '',
      userAnswer: '',
      score: 0,
      testOver: false,
      testStarted: false,
      testFrom: '',
      testTo: '',
      totalQuestions: 0
    };
  },
  computed: {
    currWord: function() {
      return this.randWords.length ? this.randWords[0] : '';
    },
    canStartTest: function() {
      return this.testFrom && this.testTo && this.testFrom !== this.testTo;
    },
    fromFlagClass: function() {
      return this.getFlagClass(this.testFrom);
    },
    toFlagClass: function() {
      return this.getFlagClass(this.testTo);
    }
  },
  methods: {
    getFlagClass: function(language) {
      const flags = {
        'german': 'germany flag',
        'english': 'united kingdom flag',
        'spanish': 'spain flag'
      };
      return flags[language] || '';
    },
    getLanguageName: function(code) {
      const names = {
        'german': 'German',
        'english': 'English',
        'spanish': 'Spanish'
      };
      return names[code] || code;
    },
    startTest: function() {
      if (!this.canStartTest) return;
      
      this.randWords = [...this.words.sort(() => 0.5 - Math.random())];
      this.incorrectGuesses = [];
      this.result = '';
      this.resultClass = '';
      this.userAnswer = '';
      this.score = 0;
      this.testOver = false;
      this.testStarted = true;
      this.totalQuestions = this.randWords.length;
    },
    onSubmit: function() {
      if (this.userAnswer.toLowerCase() === this.currWord[this.testTo].toLowerCase()) {
        this.flash('Correct!', 'success', { timeout: 1000 });
        this.score += 1;
      } else {
        this.flash('Wrong!', 'error', { timeout: 1000 });
        this.incorrectGuesses.push({
          from: this.currWord[this.testFrom],
          expected: this.currWord[this.testTo],
          given: this.userAnswer
        });
      }

      this.userAnswer = '';
      this.randWords.shift();

      if (this.randWords.length === 0) {
        this.testOver = true;
        this.displayResults();
      }
    },
    displayResults: function() {
      if (this.incorrectGuesses.length === 0) {
        this.result = 'You got everything correct. Well done!';
        this.resultClass = 'success';
      } else {
        let incorrectList = this.incorrectGuesses.map(guess => 
          `<li><strong>${guess.from}</strong> - You answered: <em>${guess.given}</em> - Correct answer: <em>${guess.expected}</em></li>`
        ).join('');
        
        this.result = `<strong>You got the following words wrong:</strong><ul>${incorrectList}</ul>`;
        this.resultClass = 'error';
      }
    }
  }
};
</script>

<style scoped>
.results {
  margin: 25px auto;
  padding: 15px;
  border-radius: 5px;
}

.error {
  border: 1px solid #ebccd1;
  color: #a94442;
  background-color: #f2dede;
}

.success {
  border: 1px solid #d6e9c6;
  color: #3c763d;
  background-color: #dff0d8;
}

select.ui.dropdown {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid rgba(34, 36, 38, 0.15);
}
</style>