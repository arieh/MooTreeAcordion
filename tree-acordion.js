var TreeAcordion = new Class({
	Implements: [Options, Events],
	options: {
		branchClass : 'branch', 
		openerClass : 'acord-handle',
		branchContrainer : 'li',
		acordOpenFunction : $empty,
		acordCloseFunction : $empty,
	},
	root : $empty,
	initialize : function(root,options){
		this.setOptions(options);
		if (this.options.acordOpenFunction == $empty) this.options.acordOpenFunction = this.acordOpenFunction;
		if (this.options.acordCloseFunction == $empty) this.options.acordCloseFunction = this.acordCloseFunction;
		this.root = $(root);
		
		var self=this,
			branches = this.root.getElements('.'+this.options.branchClass),  
			root_lis = this.root.getElements(this.options.branchContrainer);
		
		branches.each(this.initBranches.bind(this));
		
		root_lis.each(function(li){
			var branch  = li.getElement('.'+self.options.branchClass),
				parent = li.getParent(),height,
				handler = li.getElement('.'+self.options.openerClass);
			if (!handler) handler = li;
			
			if (!branch){
				li.addEvent('click',function(e){e.stopPropagation();});
				return;
			}
			branch.store('handler',handler);	
			handler.addEvent('click',function(e){
				var dis = branch.getStyle('display'), 
					last_branch= parent.retrieve('last-branch');
				
				if (!last_branch){
					parent.store('last-branch',branch);
					self.Acord(branch);
					e.stopPropagation();
					return;
				}
				
				if (last_branch === branch){
					self.Acord(branch);
				}else{
					if (last_branch.hasClass('acord-opened')) self.Acord(last_branch);
					self.Acord(branch);
					parent.store('last-branch',branch);
				}
				e.stopPropagation();
			});
		});
	},
	initBranches : function(branch){		
		var height;
		branch.setStyles({
			'position':'absolute',
			'left':-9999,
			'display':'block'
		});
		height = branch.getSize().y.toInt();
		branch.store('full-height',height);
		branch.setStyles({
			'position':'relative',
			'height':0,
			'left':0,
			overflow:'hidden'
		});
			
		branch.addClass('acord-closed');
		branch.store('parent-branch',this.findParent(branch));
	},
	Acord : function(branch){
		var height = branch.retrieve('full-height'),
			parent = branch.retrieve('parent-branch');
		if (branch.hasClass('acord-closed')){
			this.options.acordOpenFunction(branch,height);
			branch.removeClass('acord-closed');
			branch.addClass('acord-opened');
			if (parent)	this.AcordParentOpen(parent,height);
			this.fireEvent('acord-opened',branch);
			this.fireEvent('handled-opened',branch.retrieve('handler'));
		}else{
			if (parent)	this.AcordParentClose(parent,height);
			this.options.acordCloseFunction(branch,height)	
			branch.getElements(this.options.branchClass).setStyle('height',0);
			branch.removeClass('acord-opened');
			branch.addClass('acord-closed');
			this.fireEvent('acord-closed');
			this.fireEvent('handled-closed',branch.retrieve('handler'));
		}
	},
	AcordParentOpen : function(branch,height){
		if (branch == this.root) return;
		var branch_height = branch.getSize().y.toInt(),
			parent = branch.retrieve('parent-branch');
		branch.tween('height',branch_height+height);
		this.AcordParentOpen(parent,height);
	},
	AcordParentClose :function(branch,height){
		if (branch == this.root) return;
		var branch_height = branch.getSize().y.toInt(),
			parent = branch.retrieve('parent-branch');
		branch.tween('height',branch_height-height);
		this.AcordParentClose(parent,height);
	},
	findParent : function(branch){
		var parent = branch.getParent();
		while (parent.get('tag')!='body' && parent != this.root){
			if (parent.hasClass('branch')) return parent;
			parent = parent.getParent();
		}
		if (parent == this.root) return parent;
		throw "no root element found for tree";
	},
	acordOpenFunction : function(branch,height){
		branch.tween('height',height);
	},
	acordCloseFunction : function(el){
		el.tween('height',0);
	}
});