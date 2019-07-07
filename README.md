# MovePoint

**一个小的运动计算类库**
**Point类只关心数字的变化,而不关心物体是什么,做什么运动**
**我们每次调用类的计算方法也只是为了获取对应数字信息,与物体的运动没有必然关系**

## 方法的调用:
```javascript
var point = new Point(options);
```
> options是一个对象,可以用来设置物体的运动状态属性
> 比如起始点(startX, startY)初次的碰撞点 (endX, endY),加速度,运动方向等等数据

##### 如果在实例化时不添加options属性,也可以通过其他方法进行数据设置

```javascript
point.setValue(key, value);	
```
> key就是options的key

```javascript
point.setPositon(x, y);	
```
>设置当前物体的坐标
>setPosition方法是setValue方法的一个包装,为了快速设置物体的坐标,本质设置还是setValue

```javascript
point.setDirection(dirx, diry); 
```

> 设置物体的x,y运动方向,1保持不变,-1当前运动方向的反向

```javascript
point.movement(frame, cb(data));
```
> ponit运动的核心方法,frame代表运动帧率,frame是10的倍数
> 每一次point计算出新的属性后,将调用cb回调,并传入速度,方向等核心信息

### 我们不关心使用者是谁,我们只关心它从哪里来,要到哪里去
-	Point类不关心被使用在何种对象上面
- 	我们可以point计算小球的运动,比如让小球从0运动到100,并且回弹
- 	也可以使point在0-100之间运动,用以设置div的透明度
- 	也可以使point在0-360之间运动,用来制作动态扇形等等

作者： 萧十三楼      
邮箱：huajing905519160@163.com      
邮箱：905519160@qq.com      
![image](https://github.com/ShawThirteen/JumpBall/blob/master/images/%E8%90%A7%E5%8D%81%E4%B8%89%E6%A5%BC.png)
