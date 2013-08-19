/*
 * Copyright 2013 OmniFaces.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.omnifaces.cdi.viewscope;

import java.lang.annotation.Annotation;

import javax.enterprise.context.ContextNotActiveException;
import javax.enterprise.context.spi.Context;
import javax.enterprise.context.spi.Contextual;
import javax.enterprise.context.spi.CreationalContext;
import javax.enterprise.inject.spi.Bean;
import javax.enterprise.inject.spi.BeanManager;
import javax.faces.component.UIViewRoot;
import javax.faces.context.FacesContext;

import org.omnifaces.cdi.ViewScoped;

/**
 * Provide a context for the {@link ViewScoped} annotation wherein beans are managed by {@link ViewScopeManager}.
 *
 * @author Radu Creanga <rdcrng@gmail.com>
 * @author Bauke Scholtz
 * @see ViewScoped
 * @see ViewScopeManager
 * @since 1.6
 */
public class ViewScopeContext implements Context {

	// Variables ------------------------------------------------------------------------------------------------------

	private BeanManager bm;
	private Bean<ViewScopeManager> bean;
	private ViewScopeManager manager;

	// Constructors ---------------------------------------------------------------------------------------------------

	/**
	 * Construct a new view scope context.
	 * @param bm The bean manager.
	 * @param bean The view scope manager bean.
	 */
	public ViewScopeContext(BeanManager bm, Bean<ViewScopeManager> bean) {
		this.bm = bm;
		this.bean = bean;
	}

	// Actions --------------------------------------------------------------------------------------------------------

	/**
	 * Returns {@link ViewScoped} class.
	 */
	@Override
	public Class<? extends Annotation> getScope() {
		return ViewScoped.class;
	}

	/**
	 * Returns <code>true</code> if there is a {@link FacesContext}, and it has a {@link UIViewRoot}, and
	 * {@link #isInitialized()} has returned <code>true</code>.
	 */
	@Override
	public boolean isActive() {
		FacesContext context = FacesContext.getCurrentInstance();
		return context != null && context.getViewRoot() != null && isInitialized();
	}

	@Override
	public <T> T get(Contextual<T> contextual) {
		checkActive();
		return manager.getBean(contextual);
	}

	@Override
	public <T> T get(Contextual<T> contextual, CreationalContext<T> creationalContext) {
		checkActive();
		T bean = manager.getBean(contextual);
		return (bean != null) ? bean : manager.createBean(contextual, creationalContext);
	}

	// Helpers --------------------------------------------------------------------------------------------------------

	/**
	 * Check and initialize the view scope manager.
	 * @return <code>true</code> if it has been initialized.
	 */
	private boolean isInitialized() {
		if (manager == null) {
			CreationalContext<ViewScopeManager> context = bm.createCreationalContext(bean);
			manager = (ViewScopeManager) bm.getReference(bean, ViewScopeManager.class, context);
		}

		return manager != null;
	}

	/**
	 * Throws {@link ContextNotActiveException} when {@link #isActive()} returns <code>false</code>.
	 * @throws ContextNotActiveException
	 */
	private void checkActive() throws ContextNotActiveException {
		if (!isActive()) {
			throw new ContextNotActiveException();
		}
	}

}