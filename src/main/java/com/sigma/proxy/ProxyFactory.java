package com.sigma.proxy;

import java.lang.reflect.Method;

import org.springframework.cglib.proxy.Enhancer;
import org.springframework.cglib.proxy.MethodInterceptor;
import org.springframework.cglib.proxy.MethodProxy;

public class ProxyFactory {
	public static <T>T getInstance(Class<T> cla){
		Enhancer enhancer = new Enhancer();
		enhancer.setSuperclass(cla);
		enhancer.setCallback(new MethodInterceptorImpl());
		return (T) enhancer.create();
	}
	private static class MethodInterceptorImpl implements MethodInterceptor {

		@Override
		public Object intercept(Object arg0, Method method, Object[] arg2,
				MethodProxy proxy) throws Throwable {
			return proxy.invokeSuper(arg0, arg2);
		}
		
	}
}
