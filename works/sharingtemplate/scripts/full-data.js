var counter = 0;
var viewData = {
	profile: [
		{
			img: '_temp/chinese.png',
			desc: 'I am from Germany and I just love Chineese food!'
		},
		{
			img: '_temp/frenchfries.png',
			desc: 'I think french fries tastes really good with ketchup. I would love to go to France some day!'
		},
		{
			img: '_temp/hamburger.png',
			desc: 'My favourite food is hamburgers. I love american '
		},
		{
			img: '_temp/pasta.png',
			desc: 'Italian food is the best! Spagethi bolognese is my favourite dish'
		},
		{
			img: '_temp/pizza.png',
			desc: 'I like cheese and bread, so Pizza is the perfect dish for me! Yum!'
		},
		{
			img: '_temp/seafood.png',
			desc: 'I live near the coast, and we always have fresh seafood. Grilled prawns is my absolute favourite'
		},
		{
			img: '_temp/salmon.png',
			desc: 'For me fish is the best dish. I eat any fish, but I think Salmon is the best.'
		},
		{
			img: '_temp/sallad.png',
			desc: 'I always try to eat healthy food, so for me a sallad is the perfect choise! It\'s green and fresh.'
		},
		{
			img: '_temp/sushi.png',
			desc: 'Sushi is so fresh and the perfect food in the summer. That is my favourite!'
		},
		{
			img: '_temp/toast.png',
			desc: 'Every morning I start with a toast. I like it very much because I can put whatever I want in it!'
		},
		{
			img: '_temp/veal.png',
			desc: 'Meat of all kinds is my favourite!'
		},
		{
			img: '_temp/pizza.png',
			desc: 'I like cheese and bread, so Pizza is the perfect dish for me! Yum!'
		},
		{
			img: '_temp/seafood.png',
			desc: 'I live near the coast, and we always have fresh seafood. Grilled prawns is my absolute favourite'
		},
		{
			img: '_temp/salmon.png',
			desc: 'For me fish is the best dish. I eat any fish, but I think Salmon is the best.'
		},
		{
			img: '_temp/sallad.png',
			desc: 'I always try to eat healthy food, so for me a sallad is the perfect choise! It\'s green and fresh.'
		},
		{
			img: '_temp/sushi.png',
			desc: 'Sushi is so fresh and the perfect food in the summer. That is my favourite!'
		},
		{
			img: '_temp/chinese.png',
			desc: 'I am from Germany and I just love Chineese food!'
		},
		{
			img: '_temp/frenchfries.png',
			desc: 'I think french fries tastes really good with ketchup. I would love to go to France some day!'
		},
		{
			img: '_temp/hamburger.png',
			desc: 'My favourite food is hamburgers. I love american '
		},
		{
			img: '_temp/sushi.png',
			desc: 'Sushi is so fresh and the perfect food in the summer. That is my favourite!'
		},
		{
			img: '_temp/toast.png',
			desc: 'Every morning I start with a toast. I like it very much because I can put whatever I want in it!'
		},
		{
			img: '_temp/veal.png',
			desc: 'Meat of all kinds is my favourite!'
		},{
			img: '_temp/pasta.png',
			desc: 'Italian food is the best! Spagethi bolognese is my favourite dish'
		},
		{
			img: '_temp/pizza.png',
			desc: 'I like cheese and bread, so Pizza is the perfect dish for me! Yum!'
		},
		{
			img: '_temp/seafood.png',
			desc: 'I live near the coast, and we always have fresh seafood. Grilled prawns is my absolute favourite'
		},
		{
			img: '_temp/seafood.png',
			desc: 'I live near the coast, and we always have fresh seafood. Grilled prawns is my absolute favourite'
		},
		{
			img: '_temp/salmon.png',
			desc: 'For me fish is the best dish. I eat any fish, but I think Salmon is the best.'
		},
		{
			img: '_temp/sallad.png',
			desc: 'I always try to eat healthy food, so for me a sallad is the perfect choise! It\'s green and fresh.'
		}
	],
	index: function () {
		counter++;
		return counter;
	},
	additionalClass: function () {
		return function (text, render) {
			if (text < 8) {
				return 'class="soc_pl_fl"';
			} else if (text == 11 || text == 17) {
				return 'class="soc_pl_break_right"';
			} else if (text == 12 || text == 18) {
				return 'class="soc_pl_break_left"';
			} else if (text == 14 || text == 20 || text == 28) {
				return 'class="soc_pl_right"';
			} else if (text == 8) {
				return 'class="soc_pl_fl soc_pl_right"';
			}
		};
	}
};