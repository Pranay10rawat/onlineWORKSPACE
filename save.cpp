#include<bits/stdc++.h>
using namespace std;
//segmented sieve
int main()
{int test;
	cin>>test;
	while(test--)
	{bool *segSieve=new bool[1000000];

	int upper,lower;
	cin>>lower>>upper;
	for(int i=2;i<=sqrt(upper);i++)
	{   

      
        
       for(int var=2;var*i<=upper;var++)
	   if(var*i-lower>=0)
	   segSieve[var*i-lower]=true;
}
	for(int i=lower;i<=upper;i++)
		if(!segSieve[i-lower])
			cout<<i<<endl;
	}

}