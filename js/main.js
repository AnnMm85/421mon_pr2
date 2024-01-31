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
                        <input v-model="newRev">
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
            <ul>
                 <li v-for="review in reviews">
                    <p>{{ review.name }}</p>           
                    <div>
                          <div v-for="(rev,n) in review.revs">
                             <p>
                             <div>
                                <input type="checkbox" id="chRev" name="chRev" />
                                <label class="rev" for="chRev">{{rev}}</label>
                              </div>
                             </p>
                          </div>
                    </div>
                 </li>
            </ul>
        </div>  
</div>

          

    `,
    data() {
        return {
            reviews: [],
            name: null,
            errors: [],
            newRev: null,
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
        addRev() {
            // ensure they actually typed something
            if (!this.newRev) return;
            this.revs.push(this.newRev);
            this.newRev = '';
        },
        removeRev(x) {
            this.revs.splice(x, 1);
        },
        onSubmit() {
            if (this.name && (this.revs.length>=3 && this.revs.length<=5)){
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
        saveReviews() {
            let parseReview = JSON.stringify(this.reviews);
            localStorage.setItem('reviews', parseReview);
        },
    }
})


let app = new Vue({
    el: '#app',

})
