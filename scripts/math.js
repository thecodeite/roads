define(function () {
  return {
    lineIntersect2 : function (x1,y1,x2,y2, x3,y3,x4,y4) {
      var x=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
      var y=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
      if (isNaN(x)||isNaN(y)) {
        return false;
      } else {
        if (x1>=x2) {
          if (!(x2<=x&&x<=x1)) {return false;}
        } else {
          if (!(x1<=x&&x<=x2)) {return false;}
        }
        
        if (y1>=y2) {
          if (!(y2<=y&&y<=y1)) {return false;}
        } else {
          if (!(y1<=y&&y<=y2)) {return false;}
        }
          
        if (x3>=x4) {
          if (!(x4<=x&&x<=x3)) {return false;}
        } else {
          if (!(x3<=x&&x<=x4)) {return false;}
        }
          
        if (y3>=y4) {
          if (!(y4<=y&&y<=y3)) {return false;}
        } else {
          if (!(y3<=y&&y<=y4)) {return false;}
        }
      }
      return true;
    },
    lineIntersect: function (a,b,c,d,p,q,r,s) {
      var det, gamma, lambda;
      det = (c - a) * (s - q) - (r - p) * (d - b);
      if (det === 0) {
        return false;
      } else {
        lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
        gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
      }
    },
    onLine: function (ax,ay, bx,by, tx,ty) {
      var EPSILON = 5;

      var left = (ax<bx?ax:bx) - EPSILON;
      var right = (ax>bx?ax:bx) + EPSILON;
      var top = (ay>by?ay:by) + EPSILON;
      var bot = (ay<by?ay:by) - EPSILON;

      if(tx > right || tx < left || ty > top || ty < bot) return false;

      if(ax == bx) {
        if(Math.abs(tx-ax) < EPSILON) return true;
        console.log('verticale');
      }

      var a = (by - ay) / (bx - ax);
      var b = ay - a * ax;
      var isOnLine = Math.abs(ty - (a*tx+b));

      //console.log('onLine', isOnLine, a, b, ty, a*tx+b);
      return isOnLine < EPSILON;
    }
  };
});