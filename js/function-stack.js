var FunctionStack = new Class({
	Implements: Chain,
	current: null,
	priodical: null,
	initialize: function(list){
		list.push(function(){
			self.stop();
		})
		this.chain.apply(this, list);
	},
	play: function(delay){
		this.priodical = this.step.bind(this).periodical(delay);
	},
	step: function(){
		this.callChain();
	},
	stop: function(){
		$clear(this.priodical);
	}
});