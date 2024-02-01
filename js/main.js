Vue.component('product', {
    template: `
<div>
        <form class="review-form" @submit.prevent="onSubmit">
            <p v-if="errors.length">
             <b>Please correct the following error(s):</b>
             <ul>
               <li v-for="error in errors">{{ error }}</li>
             </ul>
            </p>
            
             <p>
               <label for="name">Заголовок:</label>
               <input id="name" v-model="name" placeholder="Введите заголовок">
             </p>
            
             <p>
               <label for="review">Задачи:</label>
                <p>
                    <div>
                          <div v-for="(rev,n) in revs">
                             <p>
                                <span class="rev">{{rev}}</span>
                                <button @click="removeRev(n)">Удалить</button>
                             </p>
                          </div>
                    </div>
                    <p>
                        <input v-model="Re.newRev">
                        <button @click.stop.prevent="addRev">Add Rev</button>
                    </p>             
                </p> 
             </p>
             <p>
               <input type="submit" value="Submit"> 
             </p>
        </form>


        <div>
            <h2>Карточки</h2>
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <div class="div-our-bord">
                <div class="div-bord">
                    1
                    <div class="div-all-bord-rev">
                         <div class="div-bord-rev" v-for="review in reviews">
                            <div>{{ review.name }}</div>           
                            <div>
                                  <div v-for="(rev,n) in review.revs">
                                     <p>
                                     <div>
                                        <input type="checkbox" id="rev" name="rev" v-bind:checked="Re.Oche" @click="checkPoint(review, reviews, rev)"/>
                                        <label class="rev" for="rev">{{rev}}</label>
                                      </div>
                                     </p>
                                  </div>
                            </div>
                         </div>
                    </div>
                </div>
                <div class="div-bord">
                    2
                    <div class="div-all-bord-rev">
                         <div class="div-bord-rev" v-for="review in reviews_2">
                            <div>{{ review.name }}</div>           
                            <div>
                                  <div v-for="(rev,n) in review.revs">
                                     <p>
                                     <div>
                                        <input type="checkbox" id="rev" name="rev" v-bind:checked="Re.Oche" @click="checkPoint(review, reviews_2, rev)"/>
                                        <label class="rev" for="rev">{{rev}}</label>
                                      </div>
                                     </p>
                                  </div>
                            </div>
                         </div>
                    </div>
                </div>        
                <div class="div-bord">
                    3
                    <div class="div-all-bord-rev">
                         <div class="div-bord-rev" v-for="review in reviews_3">
                            <div>{{ review.name }}</div>           
                            <div>
                                  <div v-for="(rev,n) in review.revs">
                                     <p>
                                     <div>
                                        <input type="checkbox" id="rev" name="rev" v-bind:checked="Re.Oche" @click="checkPoint(review, reviews_3, rev)"/>
                                        <label class="rev" for="rev">{{rev}}</label>
                                      </div>
                                     </p>
                                  </div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
            
        </div>  
</div>
    `,
    data() {
        return {
            reviews: [],
            reviews_2: [],
            reviews_3: [],
            name: null,
            errors: [],
            Re:{newRev:null, Oche: false},
            revs: [],
        }
    },

    mounted() {
        this.$on('review-submitted', productReview => {
            this.reviews.push(productReview);
            this.saveReviews();
        })
        if (localStorage.getItem('reviews')) {
            try {
                this.reviews = JSON.parse(localStorage.getItem('reviews'));
            } catch (e) {
                localStorage.removeItem('reviews');
            }
        }

    },
    methods: {
        checkPoint(review, rs, rev) {
            console.log(rev.Oche);
            rev.Oche=!rev.Oche;
            console.log(rev.Oche);
            if (rev.Oche == true) {
                console.log('Зачекано');
                const CountRevs = review.revs.length;
                const completedRevs = review.revs.filter(rev => rev.Oche == true).length;
                const percentComplete = (completedRevs / CountRevs) * 100;

                if (percentComplete > 50 && percentComplete < 100) {
                    const index = rs.indexOf(review);
                    this.reviews.splice(index, 1);
                    this.reviews_2.push(review);
                } else if (percentComplete === 100) {
                    const index = rs.indexOf(review);
                    this.reviews_2.splice(index, 1);
                    this.reviews_3.push(review);
                }
            }
            if (rev.Oche == false) {
                console.log('фолсно');
                const CountRevs = review.revs.length;
                const completedRevs = review.revs.filter(rev => rev.Oche == true).length;
                const percentComplete = (completedRevs / CountRevs) * 100;

                if (percentComplete > 50 && percentComplete < 100) {
                    const index = rs.indexOf(review);
                    this.reviews_3.splice(index, 1);
                    this.reviews_2.push(review);
                } else if(percentComplete < 50) {
                    const index = rs.indexOf(review);
                    this.reviews_2.splice(index, 1);
                    this.reviews.push(review);
                }
            }
        },
        addRev() {
            // ensure they actually typed something
            if (!this.Re.newRev) return;
            this.revs.push(this.Re);
            this.Re.newRev = '';
            this.Re.Oche = false;
        },
        removeRev(x) {
            this.revs.splice(x, 1);
        },
        onSubmit() {
            if (this.name && (this.revs.length >= 3 && this.revs.length <= 5)) {
                let productReview = {
                    name: this.name,
                    revs: this.revs,
                }
                console.log(productReview);
                this.$emit('review-submitted', productReview)
                this.name = null
                this.revs = []
            } else {
                if (!this.name) this.errors.push("Name required.")
                if (this.revs.length) this.errors.push("Введите от 3 до 5 задач")
            }
        },
        saveReviews(reviews) {
            let parseReview = JSON.stringify(this.reviews);
            localStorage.setItem('reviews', parseReview);
        },
    }
})


let app = new Vue({
    el: '#app',

})
